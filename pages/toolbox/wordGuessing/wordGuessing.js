Page({
  data: {
    words: {
      easy: ['cat', 'dog', 'sun', 'moon', 'tree', 'book', 'house', 'car'],
      medium: ['elephant', 'computer', 'umbrella', 'bicycle', 'telephone', 'butterfly', 'mountain'],
      hard: ['xylophone', 'javascript', 'chemistry', 'psychology', 'hippopotamus', 'cryptocurrency']
    },
    currentWord: '',
    guessedLetters: [],
    remainingGuesses: 6,
    currentDifficulty: 'medium',
    wins: 0,
    losses: 0,
    wordDisplay: '',
    guesses: '',
    alphabet: [],
    message: '',
    bgColor: '',
    title: ''
  },

  onLoad(options) {
    // 页面已经准备好，可以执行一些额外的初始化操作
    const { title, color } = options;
    // 动态设置 bgColor 和 itemName
    this.setData({
      bgColor: `bg-gradual-${color}`,
      title: title
    });
    this.newGame();
  },
  setDifficulty(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    this.setData({
      currentDifficulty: difficulty
    });
    this.newGame();
  },

  newGame() {
    const words = this.data.words[this.data.currentDifficulty];
    const currentWord = words[Math.floor(Math.random() * words.length)];
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    this.setData({
      currentWord,
      guessedLetters: [],
      remainingGuesses: 6,
      wordDisplay: '_ '.repeat(currentWord.length),
      guesses: '',
      alphabet,
      message: ''
    });
    this.resetHangman();
  },

  guessLetter(e) {
    const letter = e.currentTarget.dataset.letter;
    if (this.data.guessedLetters.includes(letter)) return;

    const guessedLetters = [...this.data.guessedLetters, letter];
    this.setData({
      guessedLetters
    });

    if (!this.data.currentWord.toUpperCase().includes(letter)) {
      this.setData({
        remainingGuesses: this.data.remainingGuesses - 1
      });
      this.showNextHangmanPart();
    }

    this.updateDisplay();
    this.checkGameEnd();
  },

  updateDisplay() {
    const wordDisplay = this.data.currentWord
        .split('')
        .map(letter => this.data.guessedLetters.includes(letter.toUpperCase()) ? letter : '_')
        .join(' ');
    this.setData({
      wordDisplay,
      guesses: `Guesses: ${this.data.guessedLetters.join(', ')}`
    });
  },

  showNextHangmanPart() {
    const parts = this.selectAllComponents('.hangman-part');
    if (parts.length > 0) {
      parts[6 - this.data.remainingGuesses].show();
    }
  },

  checkGameEnd() {
    if (this.data.currentWord.toUpperCase() === this.data.wordDisplay.replace(/\s/g, '')) {
      this.setData({
        message: 'Congratulations! You won!',
        wins: this.data.wins + 1
      });
      this.disableAllButtons();
    } else if (this.data.remainingGuesses === 0) {
      this.setData({
        message: `Game over! The word was ${this.data.currentWord}.`,
        losses: this.data.losses + 1
      });
      this.disableAllButtons();
    }
    this.updateScore();
  },

  disableAllButtons() {
    const alphabet = this.data.alphabet.map(letter => ({
      letter,
      disabled: true
    }));
    this.setData({ alphabet });
  },

  updateScore() {
    this.setData({
      score: `Wins: ${this.data.wins} | Losses: ${this.data.losses}`
    });
  },

  showHint() {
    const unguessedLetters = this.data.currentWord
        .toUpperCase()
        .split('')
        .filter(letter => !this.data.guessedLetters.includes(letter));

    if (unguessedLetters.length > 0) {
      const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
      this.guessLetter({ currentTarget: { dataset: { letter: hintLetter } } });
    }
  },

  resetHangman() {
    const ctx = wx.createCanvasContext('hangmanCanvas', this);
    ctx.setStrokeStyle('black');
    ctx.setLineWidth(4);
    ctx.moveTo(20, 230);
    ctx.lineTo(180, 230);
    ctx.stroke();

    ctx.moveTo(40, 230);
    ctx.lineTo(40, 20);
    ctx.stroke();

    ctx.moveTo(40, 20);
    ctx.lineTo(120, 20);
    ctx.stroke();

    ctx.moveTo(120, 20);
    ctx.lineTo(120, 50);
    ctx.stroke();

    ctx.draw();
  }
});
