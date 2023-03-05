import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Firestore, collectionData, collection, setDoc, doc} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { profanity } from '@2toad/profanity';
import * as uuid from 'uuid';

export interface Score { name: string; score: number;}

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.scss']
})
export class HighScoresComponent {

  @Input() score = 0; 
  highScore = false;
  name = '';
  


  scores: Observable<Score[]>;
  constructor(private firestore: Firestore, private cdRef:ChangeDetectorRef) {
    const scoreCollection = collection(firestore, 'scores');

  
    this.scores = collectionData(scoreCollection)
    .pipe(
      map(documents => documents.map(document => {
        return <Score>
        {
             name : document.name,
             score : document.score,

         };
      })),
      map(scores => scores.sort((a,b) => b.score - a.score))
    );

    this.scores.subscribe(scores => {
      const maxScore = Math.min(...scores.map(o => o.score));
      if (this.score > maxScore) {
        this.highScore = true;
      }
    })
  }

  sendScore() {

    if(profanity.exists(this.name)) {
      window.alert("Hey Smarty pants! Watch the language! Enter something else");
      return;
    }


    this.highScore = false;
    const id = uuid.v4();
    setDoc(doc(this.firestore, 'scores', id), {name : this.name, score: this.score})
    this.cdRef.detectChanges();
    

  }
}
