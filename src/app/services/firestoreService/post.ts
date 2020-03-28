import Timestamp = firebase.firestore.Timestamp;
import * as firebase from 'firebase';

export interface Post {
  // id: string;
  author: string;
  title: string;
  date: Timestamp;
  episode: string;
  content: string;
  contentPreview: string;
  podcastUrl: string;
  podcastName: string;
}
