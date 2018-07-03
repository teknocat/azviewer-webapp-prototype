export default {
  works: {
    isFetching: false,
    data: []
  },
  people: {
    isFetching: false,
    data: []
  },
  favorites: {
    isFetching: false,
    data: []
  },
  star: null,
  auth: {
    isPrepared: false,
    isLoggedIn: false,
    user: {
      id: undefined,
      name: undefined,
    },
    isFetching: false,
    error: undefined,
    jwt: ''
  },
  page: 1,
  menu: {
    isOpened: true,
  },
}