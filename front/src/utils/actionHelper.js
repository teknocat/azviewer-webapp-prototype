// https://github.com/joshgeller/react-redux-jwt-auth-example/blob/master/src/utils/index.js

class actionHelper {
  static checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }

  static parseJSON(response) {
    return response.json()


  }
}
