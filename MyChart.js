 
/*

create  an object ---> mychart=new MyChart(possibleStrikes, price, initialX, initialY, onDataChange)
                                            ^ array: [10,20,30,40,50,60,70,80,90]
                                            initialX, initialY -> arrays of same size.
                                            onDataChange -> callback function called onDataChange

This class handles the canvasjs drawn.

methods:    --->   setPrice(price)   sets the red bar of the figure
                   getSelectedData()   returns the datapoints:     [{ x: 10, y: 71 },
                                                                    { x: 20, y: 55 },
                                                                    { x: 50, y: 50 },
                                                                    { x: 75, y: 65 },
                                                                    { x: 95, y: 95 } ]
                    setXlim(xmin,xmax)




*/


 MyChart=function(possibleStrikes,price, initialX,initialY, onDataChage){
            

            

            this.price=price;

            this.chart = new CanvasJS.Chart("chartContainer", {        
                axisX:{
                    minimum: 5,
                    maximum: 95
                },
                title: {
                    text: "Try dragging column to reposition dataPoint",
                },
                data: [
                {
                    type: "line",
                    dataPoints: initialX.map((value,key)=>{return{x:value, y:initialY[key]};}),
                   
                }  ,
                {
                    type: "line",
                    dataPoints: [
                    { x: -1000, y: this.price },
                    { x: 60000, y: this.price },
                    { x: 50000, y: this.price }
                   
                    ]
                }                 
                ]
            });

            this.chart.render();

            var xSnapDistance = 10;

            var xValue, yValue;

            var mouseDown = false;
            var selected = null;
            var changeCursor = false;
            
            var timerId = null;

            this.getPosition=function(e) {
                var parentOffset = $("#chartContainer > .canvasjs-chart-container").offset();           
                var relX = e.pageX - parentOffset.left;
                var relY = e.pageY - parentOffset.top;
                xValue = Math.round(this.chart.axisX[0].convertPixelToValue(relX));
                yValue = Math.round(this.chart.axisY[0].convertPixelToValue(relY));
            } // sets xValue and yValue
            
            this.searchExistingDataPoint=function() {
                var dps = this.chart.data[0].dataPoints;
                for(var i = 0; i < dps.length; i++ ) {
                    if( (xValue >= dps[i].x - xSnapDistance && xValue <= dps[i].x + xSnapDistance) ){
                        if(mouseDown) {
                            selected = i;
                            break;
                        }
                        else {
                            changeCursor = true;
                            break; 
                        }
                    } else {
                        selected = null;
                        changeCursor = false;
                    }
                }

            }
            var that=this;
            jQuery("#chartContainer > .canvasjs-chart-container").on({
                mousedown: function(e) {
                    mouseDown = true;
                    that.getPosition(e);  
                    that.searchExistingDataPoint();
                },
                mousemove: function(e) {
                    that.getPosition(e);
                    if(mouseDown) {
                        clearTimeout(timerId);
                        timerId = setTimeout(function(){
                            if(selected != null) {
                                that.chart.data[0].dataPoints[selected].y = yValue;
                                var closerStrike=getCloserStrike(xValue);
                                console.log('indexOf point',selected);
                                if(selected!=0 && selected!=initialX.length-1) {
                                         that.chart.data[0].dataPoints[selected].x= getCloserStrike(xValue);
                                }
                                that.chart.render();
                            }   
                        }, 0);
                    }
                    else {
                        that.searchExistingDataPoint();
                        if(changeCursor) {
                            that.chart.data[0].set("cursor", "n-resize");
                        } else {
                            that.chart.data[0].set("cursor", "default");
                        }
                    }
                },
                mouseup: function(e) {
                    onDataChage();
                    if(selected != null) {
                        that.chart.data[0].dataPoints[selected].y = yValue;
                        that.chart.render();
                        mouseDown = false;
                    }
                }
            });

            distance=function(x,y){
                            return Math.abs(x-y);
                        }

            getCloserStrike=function(xValue){
                var min=distance(possibleStrikes[0],xValue);
                var res=possibleStrikes[0];
                for(var strike in possibleStrikes){
                    strike=possibleStrikes[strike];
                    if(distance(strike,xValue)<min){
                        min=distance(strike,xValue);
                        res=strike;
                    }
                }
                return res;
            }

            this.setPrice=function (price) {
                that.chart.options.data[1].dataPoints=[
                    { x: -10, y: price },
                    { x: 6000, y: price },
                    { x: 5000, y: price }
                    ];
                this.price=price;
                this.includeInY(price);
            }

            this.getSelectedData=function(){
                return this.chart.data[0].dataPoints;
            }


            this.setXlim=function(xmin,xmax){
                this.chart.options.axisX={minimum:xmin,maximum:xmax};
            }

            this.setYlim=function(xmin,xmax){
                this.chart.options.axisY={minimum:xmin,maximum:xmax};
            }

            this.includeInY=function(y){
                console.log(this.chart.options.axisY.minimum,this.chart.options.axisY.maximum);
                            if(y<this.chart.options.axisY.minimum) this.setYlim(y-30,this.chart.options.axisY.maximum);
                            if(y>this.chart.options.axisY.maximum) this.setYlim(this.chart.options.axisY.minimum,y+30);
            }

            this.setXlim( Math.min.apply(null,initialX)-30, Math.max.apply(null,initialX)+30 );
            this.setYlim( Math.min.apply(null,initialY)-30, Math.max.apply(null,initialY)+30 );
            this.includeInY(price);

            



    }