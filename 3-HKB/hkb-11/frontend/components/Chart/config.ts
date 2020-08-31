const config = {
  width: 800,
  height: 400,
  paddingX: 100,
  paddingY: 50,
  paddingX2: 20,
  lines: 11,
  circles: 5,
  piLineRatio: 1.1,
  circleColors: ['#96CEB4', '#FFEEAD', '#FF6F69', '#FFCC5C', '#88D8B0'],
}

export default {
  ...config,
  lineHeight: (config.height - config.paddingY * 2) / config.lines,
  radius: config.height / 3,
  cx: config.width / 2,
  cy: config.height / 2,
  padding: config.paddingX + config.paddingX2,
}
