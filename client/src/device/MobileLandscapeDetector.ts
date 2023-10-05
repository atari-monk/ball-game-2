export class MobileLandscapeDetector {
  constructor() {}

  public isMobileLandscape(): boolean {
    return window.innerWidth <= 767 && window.innerHeight < window.innerWidth
  }
}

// Create an instance of the class
//const mobileLandscapeDetector = new MobileLandscapeDetector()

// Check if in mobile landscape mode
//const isMobileLandscape = mobileLandscapeDetector.isMobileLandscape()

// `isMobileLandscape` will be true if detected, otherwise false
//console.log(isMobileLandscape)
