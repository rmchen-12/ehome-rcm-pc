const isIE = (function() {
  const browser = {};
  return function(ver, c) {
    const key = ver ? (c ? `is${c}IE${ver}` : `isIE${ver}`) : "isIE";
    let v = browser[key];
    if (typeof v !== "undefined") {
      return v;
    }
    if (!ver) {
      v =
        navigator.userAgent.indexOf("MSIE") !== -1 ||
        navigator.appVersion.indexOf("Trident/") > 0;
    } else {
      const match = navigator.userAgent.match(
        /(?:MSIE |Trident\/.*; rv:|Edge\/)(\d+)/
      );
      if (match) {
        const v1 = parseInt(match[1]);
        v = c
          ? c === "lt"
            ? v1 < ver
            : c === "gt"
            ? v1 > ver
            : undefined
          : v1 === ver;
      } else if (ver <= 9) {
        const b = document.createElement("b");
        const s = `<!--[if ${c || ""} IE ${ver}]><i></i><![endif]-->`;
        b.innerHTML = s;
        v = b.getElementsByTagName("i").length === 1;
      } else {
        v = undefined;
      }
    }
    browser[key] = v;
    return v;
  };
})();
export default isIE;
// test sample:
