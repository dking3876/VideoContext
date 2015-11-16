import SourceNode, { SOURCENODESTATE } from "./sourcenode";

class VideoNode extends SourceNode{
    constructor(src, gl, sourceOffset=0, preloadTime = 4){
        super(src, gl);
        this._preloadTime = preloadTime;
        this._sourceOffset = sourceOffset;
    }

    _load(){
        if (this._element !== undefined){
            if (this._element.readyState > 3){
                this._ready = true;
            }
            return;
        }
        this._element = document.createElement("video");
        this._element.src = this._elementURL;
        this._element.currentTime = this._sourceOffset;
    }

    _destroy(){
        this._element.src = "";
        this._element = undefined;
        this._ready = false;
    }

    _seek(time){
        super._seek(time);
        if (this.state === SOURCENODESTATE.playing || this.state === SOURCENODESTATE.paused){
            this._element.currentTime = this._currentTime - this._startTime + this._sourceOffset;
        }
    }

    _update(currentTime){
        if (!super._update(currentTime)) return false;
        if (this._startTime - this._currentTime < this._preloadTime)this._load();

        if (this._state === SOURCENODESTATE.playing){
            this._element.play();
            return true;
        } else if (this._state === SOURCENODESTATE.paused){
            this._element.pause();
            return true;
        }
        else if (this._state === SOURCENODESTATE.ended){
            this._element.pause();
            this._destroy();
            return false;
        }

    }

}

export default VideoNode;