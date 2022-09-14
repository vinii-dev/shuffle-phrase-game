import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private correctPhrase: string = "O peito do pé do Pedro é preto";
  private fixedWords: { word: string; index: number }[] = [ 
    { word: "O", index: 0 }, 
    { word: "do", index: 2 }, 
    { word: "do", index: 4 }, 
    { word: "é", index: 6 }
  ];
  private aditionalWords: string[] = ["peido"];
  private phraseArray: string[] = (this.correctPhrase + ' ' + this.aditionalWords.join(' '))
    .split(" ")
    .filter(word => !this.fixedWords.some(({word: fixedWord}) => fixedWord === word));

  public phrase: string = this.correctPhrase;
  public automaticShuffle: boolean = false;
  public didWin: boolean = false;
  public attempts: number = 0;
  public probability: string = this.calculateProbability();

  public shuffleArray(arr: any[]): void {
    for(let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i - 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  public async shufflePhrase(): Promise<void> {
    do {
      this.shuffleArray(this.phraseArray);

      let phraseArray = [...this.phraseArray];
      
      this.fixedWords.forEach(({ word: fixedWord, index }) => {
        phraseArray.splice(index, 0, fixedWord);
        phraseArray.splice(this.correctPhrase.split(' ').length)
      });

      this.phrase = phraseArray.join(' ');

      if(this.phrase === this.correctPhrase) {
        this.didWin = true;
      } else {
        this.attempts++;
        await new Promise(resolve => setInterval(resolve, 50));
      }
    } while(this.automaticShuffle && !this.didWin);
  }

  public resetGame(): void {
    this.phrase = this.correctPhrase;
    this.didWin = false;
    this.attempts = 0;
  }

  public calculateProbability(): string {
    //Permutation formula
    let permutation = 1;
    const totalNum = this.phraseArray.length;
    const selectedNum = this.correctPhrase.split(' ').length - this.fixedWords.length;
    for(let i = totalNum; i > totalNum - selectedNum; i-- ) {
      permutation *= i;
    }

    return `1/${permutation}`;
  }
}
