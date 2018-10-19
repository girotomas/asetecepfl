naivePrice=function(data){
    
    PA=data.PA;
    PB=data.PB;
    K=data.K;
    fK=data.fK;
    St=data.St;
    rplus=data.rplus;
    rminus=data.rminus;
    spread=data.spread;
    CB=data.CB;
    CA=data.CA;
    console.log('naivePrice arguments:  -CA:', CA, '  CB: ',CB,'  PA:', PA, ' -PB:',PB,' -K', K, '  fK:',fK,' St: ', St,' rplus: ', rplus,' rminus: ', rminus,'  spread: ', spread);

    /*subsets=function(s){
        sets = [];
        for (var i=0;2^(s.length);i++){
            subset=[];
            for(var bit=0;bit<s.length;bit++){
                subset
            }
            if(is_bit_set(i, bit)){
                subset.append(s[bit]);
            }
            sets.append(subset);
        }
        return sets;
    }*/


    // verification of arbitrage oportunities:
    N=CA.length;
    for (var i in CA){
        if(CB[i]>CA[i]) console.log('CB>CA!');
    }
    for (var i in PA){
        if(PB[i]>PA[i]) console.log('PB>PA!');
    }

    for(var i=0;i<N-2;i++){
        if( PA[i] * (K[i+2] - K[i+1]) / (K[i+2] - K[i]) + PA[i+2] * (K[i+1] - K[i]) / (K[i+2] - K[i]) > PB[i+1]) {
            console.log('concavity put violated!');
            PB[i+1] = 0.9 * (PA[i] * (K[i+2] - K[i+1]) / (K[i+2] - K[i]) + PA[i+2] * (K[i+1] - K[i]) / (K[i+2] - K[i]));
            console.log('new PB:', PB);
        }
    }









    const subsets = 
      theArray => theArray.reduce(
        (subsets, value) => subsets.concat(
         subsets.map(set => [value,...set])
        ),
        [[]]
      );



    is_bit_set=function(num, bit){
        return num & (1 << bit) > 0;
    }

    difference = function(a,b){
        return new Set([...a].filter(x => !b.has(x)));
    }



    zeros=function(n){
        return Array.apply(null, Array(n)).map(Number.prototype.valueOf,0);
    }

    // Variable creation
    N=CA.length;
    theta=zeros(N+1);
    for(var i=0;i<N+1;i++){
        theta[i]=(fK[i+1]-fK[i])/(K[i+1]-K[i]);
    }
    SA=St*(1+spread);
    SB=St*(1-spread);

    console.log('naivePrice variables created : N: ',N,' theta: ',theta,'SA' ,SA,'SB',SB);
    // Verification of no arbitrage contidions
    for (var i=0; i<N;i++){
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
            sum+=A[i]*B[i];
        }
        return sum;
    }

    ss = range(N);
    II = subsets(ss);
    p_best = Math.pow(10,6);
    deltaTheta=zeros(N);
    for(var i=0;i<N;i++){
        deltaTheta[i]= theta[i+1]-theta[i];
    }
    deltaThetaplus=deltaTheta.map((value)=>{return value * (value > 0);});
    deltaThetaminus = deltaTheta.map((value)=>{return value * (value < 0);});
    thP= deltaThetaplus.map((value,key)=>{return value * PA[ss[key]] + deltaThetaminus[key] * PB[ss[key]] });
    thC= deltaThetaplus.map((value,key)=>{return value * CA[ss[key]] + deltaThetaminus[key] * CB[ss[key]] });
    console.log('deltaTheta', deltaTheta, 'deltaThetaplus', deltaThetaplus, 'deltaThetaminus', deltaThetaminus, 'thP',thP, 'thC',thC,'ss',ss,'II',II);

    for (var key in II){
        I = II[key];
        Ic = Array.from(difference(new Set(ss), new Set(I)));
        deltaC = zeros(N);
        deltaP = deltaC;
        THI = [];
        console.log('Ic',Ic,'I',I);

        for (var key in Ic) THI.push(deltaTheta[Ic[key]]);
        KI = [];
        for (var key in Ic) KI.push(deltaTheta[Ic[key]]);
        console.log('K',K,'THI',THI);
        sumTHI = 0;
        for(var key in THI) sumTHI += THI[key];
        beta = theta[0] + sumTHI;
        b = fK[0] - theta[0] * K[0] - dot(THI, KI);
        console.log('sumTHI',sumTHI,'b',b,'beta',beta);
        pr = (1 - rplus) * Math.max(b, 0) + (1 - rminus) * Math.min(b, 0) + Math.max(beta, 0) * SA + Math.min(beta, 0) * SB ;
        
        //begin->   pr + sum(thP[Ic])
        for(var key in Ic) pr += thP[Ic[key]];

        //begin->   pr + sum(thC[I])
        for(var key in I) pr += thC[I[key]];
        console.log('pr',pr,'p_best',p_best);
        p_best = Math.min(p_best, pr)
    }
    console.log(p_best);
    return p_best




}