function createTimer() {
  let startTime = null;

  return {
    start: () => {
      startTime = Date.now();
    },
    end: () => {
      const endTime = Date.now();
      return endTime - startTime;
    },
  };
}

const timer = createTimer();

module.exports = { timer, createTimer };
