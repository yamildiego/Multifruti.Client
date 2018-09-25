app.service('CommonFunctionsService', function() {
    return {
        getLvl: function(experience) {
            var temp = experience / 35;
            if(temp > 45){
                var tempTwo = ((experience - 1575) / 2000);
                if(tempTwo <= 4)
                    return 9 + Math.round(tempTwo + 1);
                else if(tempTwo>4 && tempTwo<=16){
                    return 11 + Math.round((tempTwo + 1) / 2);
                }
                else if(tempTwo> 16 && tempTwo<=40)
                    return 15 + Math.round((tempTwo + 1) / 4);
                else
                    return 20 + Math.round((tempTwo + 1) / 8);
            } else
                return this.getLvlXExperience(experience);
        },
        getPercentageOfLevel: function(experience) {
            var _self = this;
            var lvl = _self.getLvl(experience);
            var experienceMaxBack =_self.getExperienceMaxWithLvl(lvl - 1);
            var experienceMaxActual =_self.getExperienceMaxWithLvl(lvl);

            var experienceTemp = experience - experienceMaxBack;
            var experienceMax = experienceMaxActual - experienceMaxBack;

            return ((experienceTemp * 100) / experienceMax);
        },
        convertFormatNumberKK: function(number) {
            var _self = this;
            if (number >= 1000)
                number = _self.truncator(number / 1000, 0) + 'k';
            return number;
        },
        truncator(numToTruncate, intDecimalPlaces) {
            var numPower = Math.pow(10, intDecimalPlaces);
            return ~~(numToTruncate * numPower) / numPower;
        },
        getLvlXExperience: function(experience){
            if (experience <=35){
                return 1;
            } else if(experience > 35 && experience <= 105){
                return 2;
            } else if(experience > 105 && experience <= 210){
                return 3;
            } else if(experience > 210 && experience <= 350){
                return 4;
            } else if(experience > 350 && experience <= 525){
                return 5;
            } else if(experience > 525 && experience <= 735){
                return 6;
            } else if(experience > 735 && experience <= 980){
                return 7;
            } else if(experience > 980 && experience <= 1260){
                return 8;
            } else if(experience > 1260 && experience <= 1575){
                return 9;
            }
        },
        getExperienceMaxWithLvl: function(lvl){
            if(lvl <= 9){
                switch(lvl) {
                    case 1:{ return 35; break; }
                    case 2:{ return 105; break; }
                    case 3:{ return 210; break; }
                    case 4:{ return 350; break; }
                    case 5:{ return 525; break; }
                    case 6:{ return 735; break; }
                    case 7:{ return 980; break; }
                    case 8:{ return 1260; break; }
                    case 9:{ return 1575; break; }
                }
            } else {
                var temp = 1575;
                if (lvl > 9 && lvl <= 13){
                    return (temp + ((lvl - 9) * 2000));
                } else if(lvl > 13 && lvl <= 19) {
                    temp = temp + 8000;
                    return (temp + ((lvl - 13) * 4000));
                } else if(lvl > 20 && lvl <= 25) {
                    temp = temp + 32000;
                    return (temp + ((lvl - 19) * 8000));
                } else if(lvl > 25) {
                    temp = temp + 80000;
                    return (temp + ((lvl - 25) * 16000));
                }
            }
        }
    }
});