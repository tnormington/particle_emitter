(function() {

    'use strict'
    window.onload = function() {

        var app = document.getElementById('app');
        var form = document.getElementById('app-settings');
        var s = Snap('#app');
        var formSubmits = gatherSubmitElements(form);
        var colorsInputGroup = document.getElementById('colors-input-group');
        var colorInputs = form.getElementsByTagName('input');
        var removeColorBtn = document.getElementById('remove-color');
        var addColorBtn = document.getElementById('add-color');

        var View = {
            circles: [],
            mouseDown: 0,
            createCircle: function(x, y) {
                Model.setBrushSize();
                var c = s.circle(x, y, Model.brushSize);
                var color = Controller.getColor();
                c.attr({
                    fill: color
                }).animate({
                    r: 0
                }, 1000, null, function() {
                    c.remove();
                }).animate({
                    cy: y - Model.floatAmount
                }, 1000);
            },
            checkCircleCount: function() {
                if (this.circles.length >= Model.drawLimit) {
                    return false;
                } else {
                    return true;
                }
            },
            removeColor: function(color) {
                console.log('removing: ', color)
                color.remove()
                Controller.updateColors()
            },
            removeLastColor: function() {
                var color = colorInputs[colorInputs.length - 1]
                this.removeColor(color)
            }

        }

        var Model = {
            colors: [],
            w: app.offsetWidth,
            h: app.offsetHeight,
            brushSize: 50,
            up: false,
            max: 50,
            min: 10,
            i: 2,
            drawLimit: 100,
            drawCount: 0,
            growAmount: 50,
            floatAmount: 100,
            setBrushSize: function() {
                this.brushSize = this.incrementValue(this.i, this.brushSize);
            },
            incrementValue: function(i, value) {
                if (value === this.max) {
                    this.up = !this.up;
                    value -= i;
                } else if (value === this.min) {
                    this.up = !this.up;
                    value += i;
                } else {
                    if (this.up) {
                        // incrementing
                        if (value <= this.max - i) {
                            value += i;
                        } else {
                            this.up = !this.up;
                        }
                    } else {
                        // decrementing
                        if (value >= this.min + i) {
                            value -= i;
                        } else {
                            this.up = !this.up;
                        }
                    }
                }
                return value;
            }
        }

        var Controller = {
            updateColorInputs: function() {
                colorInputs = form.getElementsByTagName('input');
            },
            updateColors: function() {
                this.updateColorInputs();
                for (var i = 0; i < colorInputs.length; i++) {
                    var color = colorInputs[i].value;
                    Model.colors[i] = color;
                }
                Model.colors.splice(colorInputs.length)
            },
            addColor: function(color) {
                Model.colors.push(color);
            },
            getColor: function() {
                var l = Model.colors.length;
                var color;
                if (l === 1) {
                    color = Model.colors[0];
                } else {
                    var num = Math.floor(Math.random() * Model.colors.length);
                    color = Model.colors[num];
                }
                return color;
            }
        }

        function getRandomColor() {
            var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            return color;
        }

        function Color(color) {
            this._init(color);
        }

        Color.prototype._init = function(value) {
            this.input = document.createElement("input");
            this.input.type = "color";
            this.input.value = value;
            colorsInputGroup.appendChild(this.input);
            // colors.push(this.input.value);
            // console.log(this.input);
            this.input.addEventListener('change', function() {
                var value = this.value;
                Controller.updateColors();
            });
            Controller.addColor(value);
        };

        function initiateApp() {
            removeColorBtn.addEventListener('click', function() {
                View.removeLastColor()
            })
            addColorBtn.addEventListener('click', function() {
                var color = new Color(getRandomColor());
            })

            app.addEventListener('mousemove', function(e) {
                if (View.mouseDown) {
                    var x = e.x;
                    var y = e.y;
                    View.createCircle(x, y);
                    Model.drawCount++;
                }
            })
            app.addEventListener('click', function(e) {
                var x = e.x;
                var y = e.y;
                View.createCircle(x, y);
                Model.drawCount++;
            })
            app.addEventListener('touchmove', function(e) {
                e.preventDefault();
                var touch = e.touches[0];
                var x = touch.pageX;
                var y = touch.pageY;
                View.createCircle(x, y);
                Model.drawCount++;
            })

            document.body.onmousedown = function() {
                View.mouseDown = 1;
            }
            document.body.onmouseup = function() {
                View.mouseDown = 0;
            }
            form.onsubmit = function(e) {
                e.preventDefault();
            }
            new Color(getRandomColor());
        }

        initiateApp();

        function gatherSubmitElements(form) {
            var form_children = returnAllChildren(form);
            return filterObject(form_children, 'submit');
        }

        function returnAllChildren(el) {
            return el.getElementsByTagName('*');
        }

        function filterObject(obj, selector) {
            var result = [];
            for (var i = 0; i < obj.length; i++) {
                var el = obj[i];
                if (el.type === selector) {
                    result.push(el);
                }
            }
            return result;
        }
    }
})();
