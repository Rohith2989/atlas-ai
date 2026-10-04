export const vertexSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = vec2(a_position.x * .5 + .5, .5 - a_position.y * .5);
  gl_Position = vec4(a_position, 0., 1.);
}
`;

export const fragmentSource = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_founder;
uniform sampler2D u_engineering;
uniform sampler2D u_wafer;
uniform vec2 u_fit;
uniform float u_progress;
uniform vec4 u_entry;
uniform vec4 u_portraitExit;
uniform vec4 u_engineeringIn;
uniform vec4 u_engineeringOut;
uniform vec4 u_waferIn;
uniform float u_split;

// Fixed photo-space noise: reversing or jumping the scroll produces the same pixels.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
}
float grainEdge(vec2 p, float distanceToEdge, float width) {
  float grain = hash(floor(p * vec2(1586.,992.)));
  float row = hash(vec2(floor(p.y * 730.),19.));
  float streak = pow(row, 18.) * .035;
  float distance = distanceToEdge + (grain - .5) * width + streak;
  return smoothstep(-.001,.002, distance);
}
float bandValue(vec4 values, float y) {
  if(y < .20) return values.x;
  if(y < .485) return values.y;
  if(y < .68) return values.z;
  return values.w;
}
vec2 bandEdges(float y) {
  if(y < .20) return vec2(0.,.20);
  if(y < .485) return vec2(.20,.485);
  if(y < .68) return vec2(.485,.68);
  return vec2(.68,1.-.09*u_split);
}
float inBounds(vec2 p) {
  return step(0.,p.x) * step(p.x,1.) * step(0.,p.y) * step(p.y,1.);
}
vec4 photo(sampler2D tex, vec2 p) {
  return texture2D(tex,clamp(p,vec2(0.),vec2(1.))) * inBounds(p);
}
vec4 over(vec4 background, vec4 foreground) {
  // Textures use straight alpha. Keep the framebuffer premultiplied.
  return vec4(foreground.rgb * foreground.a + background.rgb * (1.-foreground.a),
              foreground.a + background.a * (1.-foreground.a));
}
float reveal(vec2 p, float amount, float coordinate) {
  if(amount <= 0.) return 0.;
  if(amount >= 1.) return 1.;
  return grainEdge(p, coordinate - mix(1.02,.18,amount), .045);
}
float portraitBoundary(float y) {
  if(y < .32) return mix(.687,.655,smoothstep(.19,.32,y));
  return mix(.655,.765,smoothstep(.32,.45,y));
}
void main() {
  // A contained photographic world keeps people and circles in their original proportions.
  vec2 uv = (v_uv - .5) / u_fit + .5;
  if(inBounds(uv) < .5) { gl_FragColor=vec4(0.); return; }
  vec4 color=vec4(0.);

  if(u_progress < .501) {
    float departure=bandValue(u_portraitExit,uv.y);
    float portraitY=(uv.y >= .20 && uv.y < .485) ? .075*u_split : 0.;
    vec2 p=uv + vec2(departure*.16,-portraitY);
    vec4 human=photo(u_founder,p);
    float body=1.-smoothstep(portraitBoundary(p.y)-.01,portraitBoundary(p.y)+.01,p.x);
    float edgeCoordinate=p.x-.19*(p.y-.5);
    float person=reveal(p,u_entry.x,edgeCoordinate);
    float evidence=reveal(p,u_entry.y,1.04-p.y);
    float drawing=reveal(p,u_entry.z,1.20-p.y*.5);
    float support=mix(evidence,drawing,smoothstep(.42,.46,p.y));
    float arrival=mix(support,person,body);
    vec2 edges=bandEdges(uv.y);
    float gap=.012*u_split;
    float slots=smoothstep(edges.x,edges.x+gap+.0001,uv.y)
                 * (1.-smoothstep(edges.y-gap-.0001,edges.y,uv.y));
    float leave=departure >= 1. ? 0. : grainEdge(uv,mix(1.12,.23,departure)-uv.x,.024);
    human.a*=arrival*slots*leave;
    color=over(color,human);
  }

  // The incoming wafer stays behind the engineering image until its aperture opens.
  if(u_progress > .66) {
    float arrive=u_waferIn.x;
    float hand=u_waferIn.y;
    float detail=u_waferIn.z;
    vec2 p=uv;
    float detailArea=step(.785,uv.x)*step(uv.x,.967)*step(.628,uv.y)*step(uv.y,.839);
    vec2 detailUV=p-vec2(.045*(1.-detail),.014*(1.-detail));
    vec4 wafer=photo(u_wafer,mix(p,detailUV,detailArea));
    vec2 fromCenter=(p-vec2(.616,.451))/vec2(.255,.285);
    float circle=1.-smoothstep(.91,1.08,length(fromCenter));
    float core=reveal(p,arrive,p.x+.04*(p.y-.5));
    float fingers=reveal(p,hand,p.x+.1*(p.y-.5));
    float gate=mix(fingers,core,circle);
    float detailGate=detail>=1. ? 1. : grainEdge(p,detail-(p.x-.785)/.182,.035);
    gate=mix(gate,detailGate,detailArea);
    wafer.a*=gate;
    color=over(color,wafer);
  }

  if(u_progress > .325 && u_progress < .836) {
    float enter=bandValue(u_engineeringIn,uv.y);
    float leave=bandValue(u_engineeringOut,uv.y);
    vec2 edges=bandEdges(uv.y);
    bool outside=uv.y < .20 || uv.y >= .68;
    float drift=outside ? leave*.13 : 0.;
    float lift=uv.y < .20 ? -leave*.035 : leave*.035;
    vec2 p=uv-vec2((1.-enter)*.16+drift,outside?lift:0.);
    if(uv.y >= .485 && uv.y < .68) {
      float handoff=1.-smoothstep(.425,.50,u_progress);
      p.y=mix(p.y,.365+(p.y-.485)*.91,handoff);
    }
    float separation=smoothstep(.655,.744,u_progress);
    if(uv.y < .20) p.y=.112+(p.y-.112)/mix(1.,.55,separation);
    if(uv.y >= .68) p.y=.678+(p.y-mix(.678,.746,separation))/mix(1.,.70,separation);
    vec4 machine=photo(u_engineering,p);
    // Clip just the extraction's transparent seams, retaining the four original openings.
    float sourceSlots=step(.112,p.y)*(1.-step(.180,p.y))
      +step(.200,p.y)*(1.-step(.568,p.y))
      +step(.588,p.y)*(1.-step(.647,p.y))
      +step(.678,p.y)*(1.-step(.880,p.y));
    if(uv.y < .20) sourceSlots=step(.112,p.y)*(1.-step(.180,p.y));
    if(uv.y >= .68) sourceSlots=step(.678,p.y)*(1.-step(.880,p.y));
    float appear=enter>=1. ? 1. : reveal(p,enter,p.x);
    float slots=smoothstep(edges.x,edges.x+.006,uv.y)
      *(1.-smoothstep(edges.y-.006,edges.y,uv.y));
    // The seams close as the engineering photograph settles, not a permanent extra crop.
    slots=mix(slots,1.,smoothstep(.475,.50,u_progress));
    vec2 delta=(uv-vec2(.616,.451))/vec2(1.,.91);
    float radius=mix(0.,.75,u_waferIn.w);
    float aperture=u_waferIn.w<=0. ? 1. : grainEdge(uv,length(delta)-radius,.025);
    float retract=1.;
    if(outside) {
      retract=leave>=1. ? 0. : grainEdge(uv,1.15-uv.x-leave*.95,.025);
      aperture=1.;
    }
    machine.a*=clamp(sourceSlots,0.,1.)*appear*slots*aperture*retract;
    color=over(color,machine);
  }
  gl_FragColor=color;
}
`;

