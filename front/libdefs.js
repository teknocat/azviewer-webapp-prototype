declare type Work = {
  workId: number;
  title: string;
  _person: Person;
  favorite?: Favorite;
  xmlUrl: string;
}

declare type Person = {
  personId: number;
  familyName: string;
  givenName: string;
}

declare type Favorite = {
  favoriteId: ?string;
  userId: string;
  workId: number;
  _work?: Work;
}

declare type Auth = {
  isPrepared?: boolean;
  isLoggedIn?: boolean;
  user: {
    id?: number;
    name?: string;
  };
  isFetching?: boolean;
  error?: string;
  jwt?: string;
}

declare type Menu = {
  isOpened: boolean;
}