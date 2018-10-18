naivePrice=function(CA, CB, PA, PB, K, fK, St, rplus, rminus, spread){
 


    subsets=function(s){
        sets = [];
        for (var i=0;i++;2^(s.length)){
            subset=[];
            for(var bit=0;bit++;bit<s.length){
                subset
            }
            if(is_bit_set(i, bit)){
                subset.append(s[bit]);
            }
            sets.append(subset);
        }
        return sets;
    }


    is_bit_set=function(num, bit){
        return num & (1 << bit) > 0;
    }

    difference = function(a,b){
        return new Set([...a].filter(x => !b.has(x)));
    }



    zeros=function(n){
        return Array.apply(null, Array(N)).map(Number.prototype.valueOf,0);
    }

    // Variable creation
    N=CA.length;
    theta=zeros(N+1);
    for(var i=0;i++;i<N+1){
        theta[i]=(fK[i+1]-fK[i])/(K[i+1]-K[i]);
    }
    SA=St*(1+spread);
    SB=St*(1-spread);


    // Verification of no arbitrage contidions
    for (var i=0;i++; i<N){
        if (CA[i] - PB[i] < SB - K[i] * (1 - rplus)){
            console.log('ask arbitrage violated');
            CA[i] = 1.1 * (SB - K[i] * (1 - rplus) + PB[i]);
        }
        if (CB[i] - PA[i] > SA - K[i] * (1 - rminus)){
            console.log('bid arbitrage violated');
            CB[i]=0.9 * (SA - K[i] * (1 - rminus) + PA[i]);
        }
    }

    range=function(n){
        return [...Array(n).keys()];
    }

    dot=function(A,B){
        sum=0;
        for(var i in A){

        }
    }

    ss = range(N);
    II = subsets(ss);
    p_best = 10^6;
    deltaTheta=zeros(N+1);
    for(var i=0;i++;i<N+1){
        deltaTheta= theta[i+1]-theta[i];
    }
    deltaThetaplus=deltaTheta.map((value)=>{return value * (value > 0);});
    deltaThetaminus = deltaTheta.map((value)=>{return value * (value < 0);});
    thP= deltaThetaplus.map((value,key)=>{return value * PA[ss] + deltaThetaminus[key] * PB[ss] });
    thC= deltaThetaplus.map((value,key)=>{return value * CA[ss] + deltaThetaminus[key] * CB[ss] });


    for (var key in II){
        I = II[key];
        Ic = Array.from(difference(new Set(ss), new Set(I)));
        deltaC = zeros(N);
        deltaP = deltaC;
        THI = [];
        for (var key in Ic) THI.append(deltaTheta[Ic[key]]);
        KI = [];
        for (var key in Ic) K.append(deltaTheta[Ic[key]]);
        sumTHI = 0;
        for(var key in THI) sumTHI += THI[key];
        beta = theta[0] + sumTHI;
        b = fK[0] - theta[0] * K[0] - dot(THI, KI);
        pr = (1 - rplus) * Math.max(b, 0) + (1 - rminus) * Math.min(b, 0) + Math.max(beta, 0) * SA + Math.min(beta, 0) * SB ;
        
        //begin->   pr + sum(thP[Ic])
        for(var key in Ic) pr += thP[Ic[key]];

        //begin->   pr + sum(thC[I])
        for(var key in I) pr += thC[I[key]];
        console.log(pr);
        p_best = Math.min(p_best, pr)
    }
    return p_best



}