(function ($) {
    function PreLoad(imgs, options) {
        //array
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
        //选项合并
        this.opts = $.extend({}, PreLoad.DEFAULTS, options);
        if (this.opts.order === "ordered") {
            this._ordered()
        } else {
            this._unordered();
        }
    }
    //默认选项
    PreLoad.DEFAULTS = {
        order: 'unordered', //无序预加载
        each: null, //每张图片加载完毕后执行
        all: null //所有图片加载完后执行
    };
    //无序加载
    PreLoad.prototype._unordered = function () {
        var imgs = this.imgs,
            opts = this.opts,
            count = 0,
            len = imgs.length;
        //无序加载，图片的加载，彼此之间是独立的
        $.each(imgs, function (i, src) {
            if (typeof src != 'string') {
                return;
            }
            var imgObj = new Image();
            $(imgObj).on('load error', function () {
                opts.each && opts.each(count);
                if (count >= len - 1) {
                    opts.all && opts.all();
                }
                count++;
            });
            imgObj.src = src;
        });
    };
    //有序加载，一张图片加载完成之后，才会加载下一张图片
    PreLoad.prototype._ordered = function () {
        var opts = this.opts,
            imgs = this.imgs,
            len = imgs.length,
            count = 0;
        load();

        function load() {
            var imgObj = new Image();
            $(imgObj).on('load error', function () {
                opts.each && opts.each(count);
                if (count >= len) {
                    //所有图片已经加载完毕
                    opts.all && opts.all();
                } else {
                    load();
                }
                count++;
            });
            imgObj.src = imgs[count];
        }
    }
    $.extend({
        preload: function (imgs, opts) {
            new PreLoad(imgs, opts);
        }
    });
})(jQuery);
