new Vue({
  el: '#app',
  data() {
    return {
      timeLeft: null,
      animationDuration: null,
      timerInterval: null,
      parts: [],
      lastInactiveCircleClass: '',
      isVisible: true,
      lastClickedTube: null,
      colorCount: null, 
      tubeCount: null,
      ballsPerTube: null,
      emptyTubeCount: null,
    };
  },
  methods: {
    generateRandomParts(colorCount, tubeCount, ballsPerTube, emptyTubeCount) {
      this.resetData();
    
      setTimeout(() => {
        let randomizedParts = [];
    
        let colorsToChoose = ['pink', 'red', 'green', 'orange', 'blue', 'lime', 'purple', 'brown', 'cyan', 'gray'];
    
        if (colorCount && colorCount < colorsToChoose.length) {
          colorsToChoose = colorsToChoose.slice(0, colorCount);
        }
    
        let colorCounts = {};
        colorsToChoose.forEach(color => {
          colorCounts[color] = 0;
        });
    
        const actualTubeCount = tubeCount ? Math.min(7, tubeCount) : 5;
    
        for (let i = 0; i < actualTubeCount; i++) {
          const chosenColors = [];
          for (let j = 0; j < ballsPerTube; j++) {
            const availableColors = colorsToChoose.filter(color => colorCounts[color] < ballsPerTube);
            const randomColor = this.shuffleArray(availableColors)[0];
            chosenColors.push(randomColor);
            colorCounts[randomColor]++;
          }
          randomizedParts.push({ circles: chosenColors, topCircleClass: '' });
        }
    
        const actualEmptyTubeCount = emptyTubeCount ? Math.min(7 - actualTubeCount, emptyTubeCount) : 0;
        for (let i = 0; i < actualEmptyTubeCount; i++) {
            const inactiveCircles = [];
            for (let j = 0; j < ballsPerTube; j++) {
                inactiveCircles.push('inactive');
            }
            randomizedParts.push({ circles: inactiveCircles, topCircleClass: '' });
        }
    
        this.parts = randomizedParts;
      }, 600);
    },
    
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

    resetData() {
      this.removeClassesAndId();
    },
  removeClassesAndId() {
      document.querySelectorAll('.inactive').forEach(inactive => {
          inactive.classList.remove('inactive');
      });
      ['pink', 'red', 'green', 'orange', 'blue', 'lime', 'purple', 'brown', 'cyan', 'gray'].forEach(colorClass => {
          document.querySelectorAll('.' + colorClass).forEach(element => {
              element.classList.remove(colorClass);
          });
      });
      const selectedElement = document.getElementById('selected');
      if (selectedElement) {
          selectedElement.removeAttribute('id');
      }
  },

addCircleClass(partIndex) {
  setTimeout(() => {
  const tube = this.$refs.myTube[partIndex];
      
      const validSecondClasses = ['pink', 'red', 'green', 'orange', 'blue', 'lime', 'purple', 'brown', 'cyan', 'gray'];
      const hasSecondClass = Array.from(document.querySelectorAll('.circleTop')).some(circleTop => validSecondClasses.includes(circleTop.classList[1]));
      const hasInactiveCircle = Array.from(tube.querySelectorAll('.circle')).some(circle => circle.classList.contains('inactive'));
    
      if (tube === this.lastClickedTube) {
        const oldSelectedElement = document.getElementById('selected');
        const firstActiveCircle = tube.querySelector('.circle:not(.inactive)');
        
        if (oldSelectedElement) {
          oldSelectedElement.removeAttribute('id');
        }
        
        firstActiveCircle.id = 'selected';
        
        const circleTops = document.querySelectorAll('.circleTop');
        circleTops.forEach(circleTop => circleTop.classList.remove('pink', 'red', 'green', 'orange', 'blue', 'lime', 'purple', 'brown', 'cyan', 'gray'));
  
        this.lastClickedTube = null; 
        return;
      }
  
      this.lastClickedTube = tube; 

      if (hasInactiveCircle && hasSecondClass) {
        const circles = Array.from(tube.querySelectorAll('.circle')).reverse();
        const lastInactiveCircleIndex = circles.findIndex(circle => circle.classList.contains('inactive'));
    
        if (lastInactiveCircleIndex !== -1) {
          const lastInactiveCircle = circles[lastInactiveCircleIndex];
          lastInactiveCircle.classList.remove('inactive');
          lastInactiveCircle.classList.add(this.lastInactiveCircleClass);
        }
    
        const selectedElement = document.getElementById('selected');
        if (selectedElement) {
          const secondClass = selectedElement.classList[1];
          selectedElement.removeAttribute('id');
          selectedElement.classList.remove(secondClass);
          selectedElement.classList.add('inactive');
    
          const circleTops = document.querySelectorAll('.circleTop');
          circleTops.forEach(circleTop => circleTop.classList.remove('pink', 'red', 'green', 'orange', 'blue', 'lime', 'purple', 'brown', 'cyan', 'gray'));
        }
      } else {
        const someCircleIsActive = Array.from(tube.querySelectorAll('.circle')).some(circle => !circle.classList.contains('inactive'));
        this.lastInactiveCircleClass = '';
    
        if (someCircleIsActive) {
          const circles = Array.from(tube.querySelectorAll('.circle'));
          const firstActiveCircleIndex = circles.findIndex(circle => !circle.classList.contains('inactive'));
    
          if (firstActiveCircleIndex !== -1) {
            this.lastInactiveCircleClass = circles[firstActiveCircleIndex].classList[1];
            const addedClass = circles[firstActiveCircleIndex].classList[1];
            const firstActiveCircle = tube.querySelector('.circle:not(.inactive)');
    
            const oldSelectedElement = document.getElementById('selected');
    
            if (oldSelectedElement) {
              oldSelectedElement.removeAttribute('id');
            }
    
            firstActiveCircle.id = 'selected';
    
            const circleTops = document.querySelectorAll('.circleTop');
            const circleTop = tube.parentElement.querySelector('.circleTop');
            circleTops.forEach(circleTop => circleTop.classList.remove('pink', 'red', 'green', 'orange', 'blue', 'lime', 'purple', 'brown', 'cyan', 'gray'));
            circleTop.classList.add(addedClass);
          }
        }
      }
    
      setTimeout(() => {
        this.parts.forEach((p, index) => {
          if (index !== partIndex) {
            this.$set(p, 'topCircleClass', '');
          }
        });
      }, 1);
    
      this.$nextTick(() => {
        const tubes = this.$refs.myTube;
        let isSameSecondClass = true;
    
        tubes.forEach(tube => {
          const circles = Array.from(tube.querySelectorAll('.circle'));
    
          if (circles.length > 1) {
            const secondClass = circles[0].classList[1];
    
            for (let i = 1; i < circles.length; i++) {
              if (circles[i].classList[1] !== secondClass) {
                isSameSecondClass = false;
                break;
              }
            }
          }
        });
    
        if (isSameSecondClass) {
          clearInterval(this.timerInterval);
          this.endGame();
          document.querySelector('.showWin').classList.remove('disable');
        }
      });
    }, 5);
  },
    
    startTimer() {
      this.animationDuration = this.timeLeft

      document.querySelector('#app').classList.remove('disable');
      document.querySelector('.endGame').classList.add('disable');
      document.querySelector('.showWin').classList.add('disable');
      document.querySelector('.showLoss').classList.add('disable');

      document.querySelector('.beforeContainer').classList.remove('disable');
      document.querySelector('.beforeText').classList.remove('disable');

      const elementsToEnable = document.querySelectorAll('.main, .afterBottom, .top');
      elementsToEnable.forEach(element => {
        element.classList.add('disable');
      });

      setTimeout(() => {
        document.querySelector('.beforeContainer').classList.add('disable');
        document.querySelector('.beforeText').classList.add('disable');

        const elementsToEnable = document.querySelectorAll('.main, .afterBottom, .top');
        elementsToEnable.forEach(element => {
          element.classList.remove('disable');
        });

        this.timerInterval = setInterval(() => {
          this.timeLeft--;

          if (this.timeLeft === 0) {
            clearInterval(this.timerInterval);
            this.endGame()
            document.querySelector('.showLoss').classList.remove('disable');
          }
        }, 1000);
      }, 2000);
    },

    endGame() {
      document.querySelector('.endGame').classList.remove('disable');
    
      const elementsToEnable = document.querySelectorAll('.main, .afterBottom, .top');
      elementsToEnable.forEach(element => {
        element.classList.add('disable');
      });
    
      setTimeout(() => {
        document.querySelector('#app').classList.add('disable');

        document.querySelector('.endGame').classList.add('disable');
        document.querySelector('.showWin').classList.add('disable');
        document.querySelector('.showLoss').classList.add('disable');

        this.parts = [];
        this.resetData();
  
        this.colorCount = null;
        this.tubeCount = null;
        this.ballsPerTube = null;
        this.emptyTubeCount = null;
      }, 2000)
    }, 
  },
  mounted() {
    this.isVisible = true;

    this.timeLeft = 60;
    this.colorCount = 5;
    this.tubeCount = 5;
    this.ballsPerTube = 4;
    this.emptyTubeCount = 2;

    if (this.isVisible) {
      setTimeout(() => {
          this.startTimer();
          this.generateRandomParts(this.colorCount, this.tubeCount, this.ballsPerTube, this.emptyTubeCount);
      }, 10);
  }
  },
});