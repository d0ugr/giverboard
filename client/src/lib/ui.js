


export function elementPoint(event) {
  const rect = event.target.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

export function screenToSvg(svg, point) {
  const pt  = svg.createSVGPoint();
  pt.x = point.x;
  pt.y = point.y;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}



