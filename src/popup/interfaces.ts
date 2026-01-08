export interface Team {
  id: string;
  name: string;
  avatar: string;
  acronym?: string;
}

export interface Game {
  id: string;
  status: string;
  winner_id: string | null;
  length?: number;
  scheduled_at?: string;
  [key: string]: any;
}

export interface Match {
  id: string;
  status: string;
  scheduled_at: string;
  team1: Team | string;
  team2: Team | string;
  winner_id?: string;
  game: string;
  league: string;
  league_slug: string;
  league_avatar: string;
  serie: string;
  tournament: string;
  games: { [key: string]: Game };
  has_details?: boolean;
}

export interface Streamer {
  name: string;
  username: string;
  isStreaming: boolean;
  started_at?: string;
  title?: string;
  viewer_count?: number;
  game?: string;
  avatar: string;
  [key: string]: any;
}

export interface Video {
  id: string;
  published_at: string;
  title: string;
  thumbnail: string;
  channel_title: string;
  channel_id: string;
  [key: string]: any;
}

export interface Notification {
  title: string;
  message: string;
  start: string;
  until: string;
}

export interface Updates {
  [version: string]: string;
}

export interface Socials {
  twitter?: string;
  youtube?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
}

export interface Settings {
  DEFAULT_PAGE?: string;
  LIVE?: boolean;
  VIDEO?: boolean;
  MATCH_START?: boolean;
  MATCH_END?: boolean;
  GAME_END?: boolean;
  CUSTOM?: boolean;
  [key: string]: any;
}

export interface CalendarFilters {
  order: string;
  games: string;
  leagues: string;
  years: string;
}

export interface FiltersOptions {
  games: string[];
  leagues: string[];
  years: number[];
}

export interface Roster {
  name: string;
  avatar: string;
  [key: string]: any;
}

export interface Member {
  [key: string]: any;
}
