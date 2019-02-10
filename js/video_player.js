/**
*@description class VideoPlayerBasic который, отвечает за произведение видео
*/

class VideoPlayerBasic {
	
	/**
	* @description {settings} -  принимает настройки
	* @returns {undefined} - undefined
	*/
	
    constructor(settings) {
      this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings); // Функция Object.assign получает список объектов и копирует в первый target свойства из остальных.
      this._videoContainer = null;
      this._video = null; // видео
      this._toggleBtn = null; // Кнопка для переключения
      this._progress = null; // Заполняется жёлтым цветом время видео
      this._mouseDown = false;
      this._progressVolume = null;
    }

	/**
	* @description - метод класса init() нужен для инициализации функций _addTemplate(), _setElements(), _setEvents()
	* @returns {undefined} - undefined
	*/
	
    init() {
      // Проверить передані ли  видео и контейнер
      if (!this._settings.videoUrl) return console.error("Передайте адрес видео");
      if (!this._settings.videoPlayerContainer) return console.error("Передайте селектор контейнера");
      
      // Создадим разметку и добавим ее на страницу
      this._addTemplate();
      // Найти все элементы управления
      this._setElements();
      // Установить обработчики событий
      this._setEvents();
    }

	/**
	* @description - метод toggle, содержит переключатель на проигрывание и остановку видео
	* @returns {undefined} - undefined 
	*/
	
    toggle() {
      const method = this._video.paused ? 'play' : 'pause';
      this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
      this._video[method]();
    }

	/**
	* @description - метод _handlerProgress() высчитывает процент продолжтиельности проигрывания видео
	* @returns {undefined} - undefined
	*/
	
    _handlerProgress() {
      const percent = (this._video.currentTime / this._video.duration) * 100;
      this._progress.style.flexBasis = `${percent}%`;
    }

    /**
     * @description - метод класса _handlerProgressVolume() высчитывает значение для громкости
     */

    _handlerProgressVolume() {
      this._progressVolumeValue = this._progressVolume.value * 0.1;
      this._video.volume = this._progressVolumeValue;
    }

    /**
     * @description метод, который отвечает за скорость проигрывания видео
     */

    _speedPlayer() {
      this._speedValue = this._speed.value;
      this._video.playbackRate = this._speedValue;
    }

    /**
     * @description - метод _playSkip, необходим для скипа назад на значение skipPrev
     */

    _playSkip() { this._video.currentTime += this._settings.skipPrev; }
    
    /**
     * @description - метод _playSkipTo, необходим для скипа вперёд на значение skipNext
     */

    _playSkipTo() { this._video.currentTime += this._settings.skipNext; }

    /**
     * @description - метод _playVideo, необходим для того, чтобы видео перематывалось вперёд и назад в зависимости от координат места где было произведено событие
     * @param {e} e - элемент на котором было произведено событие
     * @returns {undefined} - undefined
     */

    _playVideo(e) {
      this._half = this._video.offsetWidth / 2;
      e.offsetX < this._half ? this._playSkip() : this._playSkipTo()
    }

	/**
  * @description - метод _scrub(e), необходим для перемотки видео в то место куда мы нажали на полосе
  * @param {e} - элемент, где было произведено событие
  * @returns {undefined} - undefined
	*/
	
    _scrub(e) {
      this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
    }
	
	/**
  * @description - метод _setElements(), устанавливает классы
	* @returns {undefined} - undefined
	*/

    _setElements() {
      this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
      this._video = this._videoContainer.querySelector('video');
      this._toggleBtn = this._videoContainer.querySelector('.toggle');
      this._progress = this._videoContainer.querySelector('.progress__filled');
      this._progressContainer = this._videoContainer.querySelector('.progress');
      this._progressVolume = this._videoContainer.querySelector('.volume');
      this._speed = this._videoContainer.querySelector('.speed');
      this._skip = this._videoContainer.querySelector('.skip_back');
      this._skipTo = this._videoContainer.querySelector('.skip_forward');
    }

	/**
	* @description - метод _setEvents() устанавливает обработчики событий
	* @returns {undefined} - undefined
	*/
	
    _setEvents() {
      this._video.addEventListener('click', () => this.toggle());
      this._toggleBtn.addEventListener('click', () => this.toggle());
      this._video.addEventListener('timeupdate', () => this._handlerProgress());
      this._progressContainer.addEventListener('click', (e) => this._scrub(e));
      this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._scrub(e));
      this._progressContainer.addEventListener('mousedown', (e) => this._mouseDown = true);
      this._progressContainer.addEventListener('mouseup', (e) => this._mouseDown = false);
      // Работа со звуком
      this._progressVolume.addEventListener('mousemove', (e) => this._mouseDown && this._handlerProgressVolume());
      this._progressVolume.addEventListener('mousedown', (e) => this._mouseDown = true);
      this._progressVolume.addEventListener('mouseup', (e) => this._mouseDown = false);
      // Работа со скоростью произведения видео
      this._speed.addEventListener('mousemove', (e) => this._mouseDown && this._speedPlayer());
      this._speed.addEventListener('mousedown', (e) => this._mouseDown = true);
      this._speed.addEventListener('mouseup', (e) => this._mouseDown = false);      
      // Работа со скипом
      this._skip.addEventListener('click', () => this._playSkip())
      this._skipTo.addEventListener('click', () => this._playSkipTo())
      // Работа с перемоткой видео по нажатию на первую и вторую половину видео
      this._video.addEventListener('dblclick', (e) => this._playVideo(e));
    }
	
	/**
	* @description - метод _addTemplate()
	*
	*/

    _addTemplate() {
      const template = this._createVideoTemplate();
      const container = document.querySelector(this._settings.videoPlayerContainer);
      container ? container.insertAdjacentHTML("afterbegin", template) : console.error('контейнер не найден');
    }

	/**
	* @description - метод _createVideoTemplate(), созздаёт разметку
	* @returns {undefined} - undefined
	*/
	
    _createVideoTemplate() {
      return `
      <div class="player">
        <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
        <div class="player__controls">
          <div class="progress">
          <div class="progress__filled"></div>
          </div>
          <button class="player__button toggle" title="Toggle Play">►</button>
          <input type="range" name="volume" class="player__slider volume" min=0 max="10" step="0.05" value="${this._settings.volume}">
          <input type="range" name="playbackRate" class="player__slider speed" min="0.5" max="2" step="0.1" value="1">
          <button data-skip="-1" class="player__button skip_back">« ${this._settings.skipPrev}s</button>
          <button data-skip="1" class="player__button skip_forward">${this._settings.skipNext}s »</button>
        </div>
      </div>
      `;
    }

	/**
	* @description - метод getDefaultSettings()
	*
	*/
	
    static getDefaultSettings() {
        /**
         * Список настроек
         * - адрес видео
         * - тип плеера "basic", "pro"
         * - controls - true, false
         */
        return {
          videoUrl: '',
          videoPlayerContainer: '.myplayer',
          volume: this._progressVolumeValue
        }
    }
}

const myPlayer = new VideoPlayerBasic({
  videoUrl: 'video/mov_bbb.mp4',
  videoPlayerContainer: 'body',
  skipNext: 2,
  skipPrev: -2
});

myPlayer.init();