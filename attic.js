/**
 * Provides localStorage and cookie interfacing. LocalStorage
 * calls will default to using cookies when localStorage is not present.
 */

(function () {
  var lsExists = (window.localStorage !== undefined),
      base     = encodeURIComponent(location.host),
      attic    = window.attic = {};

  /**
   * A shortcut for encodeURIComponent
   */
  function encode(val) {
    return encodeURIComponent(val);
  }

  /**
   * A shortcut for decodeURIComponent
   */
  function decode(val) {
    return decodeURIComponent(val);
  }

  /**
   * If `val` is a string, attempts to parse it
   * as JSON. If the parsing fails, returns the string.
   */
  function maybeParse(val) {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch (err) {
        return val;
      }
    } else {
      return val;
    }
  }

  /**
   * Calls JSON.stringify in the case of a non-string.
   */
  function maybeStringify(val) {
    return typeof val === 'string' ? val : JSON.stringify(val);
  }

  /**
   * Allows you to retrieve an item by name from localStorage.
   * Expects items to be prefixed with a base derived from
   * location.host. Automatically parses the value retrieved.
   */
  function getWithLocalStorage(name) {
    return maybeParse(decode(localStorage.getItem(base + ':' + encode(name))));
  }

  /**
   * Allows you to set an item by name in localStorage.
   * Prefixes items with a base derived from location.host.
   * Automatically stringifies values before storing.
   */
  function setWithLocalStorage(name, value) {
    var item = encode(maybeStringify(value));
    return localStorage.setItem(base + ':' + encode(name), item);
  }

  /**
   * Allows you to remove an item by name from localStorage.
   * Expects the item to be prefixed with a base derived from location.host.
   */
  function rmWithLocalStorage(name) {
    var itemName = base + ':' + encode(name);
    return localStorage.removeItem(itemName);
  }

  /**
   * Allows you to retrieve an item by name from the cookies.
   * Expects items to be prefixed with a base derived from
   * location.host. Automatically parses the value retrieved.
   */
  function getWithCookie(name) {
    var cookies = document.cookie.split(';'),
        toFind  = base + ':' + encode(name),
        len     = cookies.length,
        split,
        val,
        i;

    /*
     * Iterate over all cookies.
     */
    for (i = 0; i < len; i += 1) {
      split = cookies[i].split('=');

      /*
       * If the name of the cookie is a match,
       * decode and parse the value. Kill the map.
       */
      if (split[0] === toFind) {
        val = maybeParse(decode(split[1]));
        break;
      }
    }

    return val;
  }

  /**
   * Allows you to set an item by name in cookies.
   * Prefixes items with a base derived from location.host.
   * Automatically stringifies values before storing.
   */
  function setWithCookie(name, value) {
    var item = encode(maybeStringify(value));
    return (document.cookie = (base + ':' + encode(name)) + '=' + item);
  }

  /**
   * Allows you to remove an item by name from cookies.
   * Expects the item to be prefixed with a base derived from location.host.
   */
  function rmWithCookie(name) {
    var itemName = base + ':' + encode(name),
        expiry   = 'Thu, 01 Jan 1970 00:00:00 GMT';

    /*
     * To remove a cookie, you have to overwrite it and set its
     * `expires` date to some time previous to now. The browser
     * will then delete it.
     */
    return (document.cookie = itemName + '=null; expires=' + expiry);
  }

  /**
   * Expose functionality.
   */

  /**
   * Provide basic get, set, and rm functionality.
   */
  attic.set = lsExists ? setWithLocalStorage : setWithCookie;
  attic.get = lsExists ? getWithLocalStorage : getWithCookie;
  attic.rm  = lsExists ? rmWithLocalStorage  : rmWithCookie;

  /**
   * Allows users to use cookies deliberately with a nice
   * get, set, rm interface.
   */
  attic.setCookie = function (name, value) {
    return setWithCookie('_Attic_cookie_' + name, value);
  };
  attic.getCookie = function (name) {
    return getWithCookie('_Attic_cookie_' + name); 
  };
  attic.rmCookie = function (name) {
    return rmWithCookie('_Attic_cookie_' + name);
  };

}());