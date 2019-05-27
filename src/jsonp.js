export const jsonp = (url, callback) => {
  // Most examples I've found use either jQuery or other similar libraries to handle JSONP,
  // including the API's website
  // It would also be prudent to check the result for malicious content, but we would first need to
  // convert the result to a string, and I don't see how we can do that without XMLHttpRequest requests
  // which defeats the purpose of using JSONP
  // Apparently, there was a website - json-p.org, with more info on JSONP security,
  // but it's no longer available

  const callbackName = "JSONP";
  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };
  const script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
};