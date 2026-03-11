export interface Verse {
  number: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  testament: 'Old' | 'New';
  chapters: Chapter[];
}

export const BIBLE_BOOKS: Book[] = [
  {
    id: 'gen',
    name: 'Genesis',
    testament: 'Old',
    chapters: [
      {
        number: 1,
        verses: [
          { number: 1, text: 'In the beginning God created the heaven and the earth.' },
          { number: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
          { number: 3, text: 'And God said, Let there be light: and there was light.' },
          { number: 4, text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
          { number: 5, text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
        ]
      },
      {
        number: 2,
        verses: [
          { number: 1, text: 'Thus the heavens and the earth were finished, and all the host of them.' },
          { number: 2, text: 'And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.' },
        ]
      }
    ]
  },
  {
    id: 'psa',
    name: 'Psalms',
    testament: 'Old',
    chapters: [
      {
        number: 23,
        verses: [
          { number: 1, text: 'The LORD is my shepherd; I shall not want.' },
          { number: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
          { number: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
          { number: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
        ]
      }
    ]
  },
  {
    id: 'mat',
    name: 'Matthew',
    testament: 'New',
    chapters: [
      {
        number: 5,
        verses: [
          { number: 1, text: 'And seeing the multitudes, he went up into a mountain: and when he was set, his disciples came unto him:' },
          { number: 2, text: 'And he opened his mouth, and taught them, saying,' },
          { number: 3, text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.' },
        ]
      }
    ]
  },
  {
    id: 'jhn',
    name: 'John',
    testament: 'New',
    chapters: [
      {
        number: 3,
        verses: [
          { number: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' }
        ]
      }
    ]
  }
];
