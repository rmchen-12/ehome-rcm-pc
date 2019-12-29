/**
 * dynamic add script to html
 *
 * @param url
 * @param callback
 */
export default function createScript(url, callback) {
  const oScript = document.createElement('script');
  oScript.type = 'text/javascript';
  oScript.async = true;
  oScript.src = url;

  oScript.onload = function () {
    callback();
  }

  document.body.appendChild(oScript);
}
