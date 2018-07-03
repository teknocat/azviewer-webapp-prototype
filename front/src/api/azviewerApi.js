// @flow
import { API_ROOT } from './api-config';

class azviewerApi {
  static getWork(workId: number) {
    const url = `${API_ROOT}/works/${workId}?embed=_person`

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      })
  }

  static getAllWorks(categoryKey: string, personId: number, page: number = 1) {
    // const limit = categoryKey ? 10 : 100;
    const limit = 100;
    // const limit = 10;

    const index = categoryKey ? this.getIndex(categoryKey) : null;
    let url;
    if (index) {
      url = `${API_ROOT}/works?embed=_person&limit=${limit}&index=${index}&page=${page}`
    } else if (personId) {
      url = `${API_ROOT}/works?embed=_person&personId=${personId}&limit=${limit}&page=${page}`
    } else {
      url = `${API_ROOT}/works?embed=_person&limit=${limit}&page=${page}`
    }

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      })
  }

  // TODO マッピング構造を考える
  static getIndex(key: string) {
    switch (key) {
      case "a":
        return 'あ';
      case "i":
        return 'い';
      case "u":
        return 'う';
      case "e":
        return 'え';
      case "o":
        return 'お';

      case "ka":
        return 'か';
      case "ki":
        return 'き';
      case "ku":
        return 'く';
      case "ke":
        return 'け';
      case "ko":
        return 'こ';

      case "sa":
        return 'さ';
      case "si":
        return 'し';
      case "su":
        return 'す';
      case "se":
        return 'せ';
      case "so":
        return 'そ';

      case "ta":
        return 'た';
      case "ti":
        return 'ち';
      case "tu":
        return 'つ';
      case "te":
        return 'て';
      case "to":
        return 'と';

      case "na":
        return 'な';
      case "ni":
        return 'に';
      case "nu":
        return 'ぬ';
      case "ne":
        return 'ね';
      case "no":
        return 'の';

      case "ha":
        return 'は';
      case "hi":
        return 'ひ';
      case "hu":
        return 'ふ';
      case "he":
        return 'へ';
      case "ho":
        return 'ほ';

      case "ma":
        return 'ま';
      case "mi":
        return 'み';
      case "mu":
        return 'む';
      case "me":
        return 'め';
      case "mo":
        return 'も';

      case "ya":
        return 'や';
      case "yu":
        return 'ゆ';
      case "yo":
        return 'よ';

      case "ra":
        return 'ら';
      case "ri":
        return 'り';
      case "ru":
        return 'る';
      case "re":
        return 'れ';
      case "ro":
        return 'ろ';

      case "wa":
        return 'わ';
      case "wo":
        return 'を';
      case "n":
        return 'ん';

    }
    return '';
  }

  static getAllPeople(categoryKey: string, page: number = 1) {
    const index = this.getIndex(categoryKey);
    let url;
    if (index) {
      url = `${API_ROOT}/people?limit=100&index=${index}&page=${page}`
    } else {
      url = `${API_ROOT}/people?limit=100&page=${page}`
    }

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      })
  }

  // TODO "auth: Auth"とするとtokenがNaNになる
  static getFavorites(auth: any, page: number = 1) {
    const token = auth.jwt;
    const url = `${API_ROOT}/favorites?embed=_work&limit=100&page=${page}`;

    return fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      })
  }

  static addFavorite(auth: any, workId: number) {
    const token = auth.jwt;
    const url = `${API_ROOT}/favorites`;

    return fetch(url,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          workId: workId
        }),
      })
      .then(response => {
        // TODO エラー処理
        console.log(response.ok);
        // return response.json();
        return response.blob();
      })
      .catch(error => {
        return error;
      })
  }

  static removeFavorite(auth: any, favoriteId: string) {
    const token = auth.jwt;
    const url = `${API_ROOT}/favorites/${favoriteId}`;

    return fetch(url,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      .then(response => {
        // TODO エラー処理
        console.log(response.ok);
        return response.json();
      })
      .catch(error => {
        return error;
      })
  }

  static getToken({userName, password}) {
    const url = `${API_ROOT}/login/user`;

    return fetch(url,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({userName: userName, password: password}),
      })
      .then(response => {
        // if (!response.ok) {
        //   throw new Error(response);
        //   return null
        // }
        return response.json();
      })
      .catch(error => {
        console.error("getToken error");
        console.error(error);
        return error;
      })
  }

  static searchWorks(keyword: string) {
    const limit = 100;

    let url;
    url = `${API_ROOT}/works?embed=_person&limit=${limit}&q=${keyword}`

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      })
  }

  static searchPeople(keyword: string) {
    const limit = 100;

    let url;
    url = `${API_ROOT}/people?limit=${limit}&q=${keyword}`

    return fetch(url)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      })
  }


}

export default azviewerApi;