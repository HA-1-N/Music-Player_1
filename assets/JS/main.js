// 1. Render Song
// 2. Scroll TOp (Tùy từng front)
// 3. Play/Pause Song
// 4. CD rotate (Tùy từng front)  // Animate API
// 5. Next / Prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active Song
// 9. Scroll active song into view
//10. Play song when click



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER_MUSIC_1';

const playerEl = $('.player');
const playlistMusicEl = $('.js-list-music');
const phayMusicEl = $('.play-item');
const headerNamemusicEl = $('.js-header-name-music');
const headerNameSingerEl = $('.js-header-player-song');
const imgCDitemEl = $('.img-cd-item');
const audioEl = $('#audio');
const playBtn = $('.btn-play-pause');
const playMp3 = $('.play-item');
const pauseMp3 = $('.pause-item');
const progressEl = $('#progress');
const nextBtn = $('.btn-control-skip-right');
const prevBtn = $('.btn-control-skip-left');
const randomBtn = $('.btn-control-suffer');
const redoBtn = $('.btn-redo');
const currentTimeMusicEl = $('.current-timemusic');
const sumTimeMusicEl = $('.sum-time-music');

const app = {
    listMusic: [

        {
            name: "Trú Mưa",
            singer: "HKT",
            path: "./assets/music/TruMua-HKTBand_x6jt.mp3",
            img: "./assets/img/img_1.jpg",
            time: "4:48",
        },

        {
            name: "Ái Nộ",
            singer: "Masew, Khoi Vu",
            path: "./assets/music/AiNo1-MasewKhoiVu-7078913.mp3",
            img: "./assets/img/img_2.jpg",
            time: "3:20",
        },

        {
            name: "Cưới thôi",
            singer: "Masew, Masiu, BRay, TAPVietNam",
            path: "./assets/music/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3",
            img: "./assets/img/img_3.jpg",
            time: "3:02",
        },

        {
            name: "Dịu dàng em đến",
            singer: "ERIK, NinjaZ",
            path: "./assets/music/DiuDangEmDen-ERIKNinjaZ-7078877.mp3",
            img: "./assets/img/img_4.jpg",
            time: "3.05",
        },

        {
            name: "Hương",
            singer: "Van Mai Huong, Negav",
            path: "./assets/music/Huong-VanMaiHuongNegav-6927340.mp3",
            img: "./assets/img/img_6.jpg",
            time: "3:30",
        },

        {
            name: "Cách Ngạn Remix",
            singer: "Diêu Lục Nhất",
            path: "./assets/music/CachNganRemix-DieuLucNhat-6558791.mp3",
            img: "./assets/img/img_5.jpg",
            time: "4:24",
        },
    ],

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRedo: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},   // parse lưu vào loacl storate thành object
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    // định nghĩa thuộc tính
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.listMusic[this.currentIndex];
            }
        });  //định nghĩa một thuộc tính mới trực tiếp trên một đối tượng hoặc sửa đổi một thuộc tính hiện có trên một đối tượng và trả về đối tượng.
    },

    handleEvent: function () {
        const _this = this;  // Trả về đối tượng là app: _this = app

        // Xử lý khi click play Cách 2
        // playMp3.onclick = function () {
        //     audioEl.play();
        //     playerEl.classList.add('playing');
        // }

        // pauseMp3.onclick = function () {
        //     audioEl.pause();
        //     playerEl.classList.remove('playing');
        // }


        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audioEl.pause();

            } else {
                audioEl.play();
            }
        }

        // Khi Music play
        audioEl.onplay = function () {
            _this.isPlaying = true;
            playerEl.classList.add('playing');
        }

        // Khi music pause
        audioEl.onpause = function () {
            _this.isPlaying = false;
            playerEl.classList.remove('playing');
        }

        // Khi tien do bai hat change
        audioEl.ontimeupdate = function (e) {
            if (audioEl.duration) {
                const progress = Math.floor((audioEl.currentTime / audioEl.duration) * 100);  // Tinh theo phan tram
                progressEl.value = progress;
            }

            audioEl.addEventListener("loadeddata", () => {
                let totalTime = audioEl.duration;
                let totalMinutes = Math.floor(totalTime / 60);
                let totalSeconds = Math.floor(totalTime % 60);
                if (totalSeconds < 10) {
                    totalSeconds = `0${totalSeconds}`;
                }
                sumTimeMusicEl.innerText = `${totalMinutes}:${totalSeconds}`;
            });

            let totalcurrentTime = audioEl.currentTime;
            let currentMinutesTime = Math.floor(totalcurrentTime / 60);
            let currentSecondsTime = Math.floor(totalcurrentTime % 60);
            if (currentSecondsTime < 10) {
                currentSecondsTime = `0${currentSecondsTime}`;
            }
            currentTimeMusicEl.innerText = `${currentMinutesTime}:${currentSecondsTime}`;

        }

        // Xử lý khi tua 
        progressEl.oninput = function (e) {     // Khi tua thì bài hát vẫn phát được
            const progressTime = audioEl.duration / 100 * e.target.value;
            audioEl.currentTime = progressTime;
        }

        // Next Song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audioEl.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Prev Song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audioEl.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // Repeat song
        redoBtn.onclick = function () {
            _this.isRedo = !_this.isRedo;
            redoBtn.classList.toggle('active', _this.isRedo);
            _this.setConfig('isRedo', _this.isRedo);
        }

        // Random Song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
            _this.setConfig('isRandom', _this.isRandom);
        }

        // Xử lý audio khi ended
        audioEl.onended = function () {
            if (_this.isRedo) {
                audioEl.play();
            } else {
                nextBtn.click();
            }
        }

        // Lắng nghe hành vi click vào playList
        playlistMusicEl.onclick = function (e) {
            const songNode = e.target.closest('.play-list-music:not(.active)');
            if (songNode) {  // closest tim kiem cac phan tu (|| e.target.closest('.option') co hpac khong)
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audioEl.play();
                    _this.render();
                }
            }
        }
    },

    render: function () {
        const htmls = this.listMusic.map((song, index) => {
            return `
            <div class="play-list-music ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="play-list-item">
                    <h4 class="music-name">${song.name}</h4>
                </div>
                <span class="time-song js-total-time-song">${song.time}</span>
            </div>
            `;
        });

        playlistMusicEl.innerHTML = htmls.join('');
        redoBtn.classList.toggle('active', this.isRedo);
        randomBtn.classList.toggle('active', this.isRandom);
    },

    // Chi load Music
    loadCurrentSong: function () {
        headerNamemusicEl.textContent = this.currentSong.name;
        headerNameSingerEl.textContent = this.currentSong.singer;
        imgCDitemEl.src = this.currentSong.img;
        audioEl.src = this.currentSong.path;
    },

    // Load config
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRedo = this.config.isRedo;
    },

    // Next Song
    nextSong: function () {  // This trong day la Doi tuong app
        this.currentIndex++;   // Cộng lên 1 đơn vị trc
        // this.currentIndex trong ddk bat dau = 1
        if (this.currentIndex >= this.listMusic.length) {   // = app.listMusic.length
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },

    // PrevSong
    prevSong: function () {
        this.currentIndex--;   // = app.currenetIndex
        if (this.currentIndex < 0) {
            this.currentIndex = this.listMusic.length - 1;
        }
        this.loadCurrentSong();
    },

    // Random Song
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.listMusic.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // scrollToActiveSong
    scrollToActiveSong: function () {
        setTimeout(() => {

            if (this.currentIndex == 0) {
                $('.play-list-music.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end',
                });
            } else {
                $('.play-list-music.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }, 200);
    },


    start: function () {
        // Gán cấu hình config vao ứng dụng
        this.loadConfig();
        this.handleEvent();
        this.defineProperties();
        this.loadCurrentSong(); // Tai thong tin bai hat dau tien
        this.render();

        // Hiển thị trạng thái ban đầu của random vs redo
        // redoBtn.classList.toggle('active', this.isRedo);
        // randomBtn.classList.toggle('active', this.isRandom);
    },
};

app.start();