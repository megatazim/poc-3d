/**
@license

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
function _0x571e(_0x2c7a47,_0x4a74d0){var _0x2e0a49=_0x2e0a();return _0x571e=function(_0x571e12,_0x1a15e5){_0x571e12=_0x571e12-0xd9;var _0x5ad719=_0x2e0a49[_0x571e12];return _0x5ad719;},_0x571e(_0x2c7a47,_0x4a74d0);}var _0x1ab4f1=_0x571e;(function(_0xe26767,_0x30a25a){var _0x1669e3=_0x571e,_0x177b5c=_0xe26767();while(!![]){try{var _0x2959d1=parseInt(_0x1669e3(0xe8))/0x1+-parseInt(_0x1669e3(0xe6))/0x2*(-parseInt(_0x1669e3(0xeb))/0x3)+-parseInt(_0x1669e3(0xe1))/0x4+-parseInt(_0x1669e3(0xdc))/0x5+parseInt(_0x1669e3(0xe3))/0x6*(parseInt(_0x1669e3(0xe0))/0x7)+-parseInt(_0x1669e3(0xe2))/0x8*(-parseInt(_0x1669e3(0xe5))/0x9)+-parseInt(_0x1669e3(0xe7))/0xa;if(_0x2959d1===_0x30a25a)break;else _0x177b5c['push'](_0x177b5c['shift']());}catch(_0xba2b56){_0x177b5c['push'](_0x177b5c['shift']());}}}(_0x2e0a,0x5cb0a));function _0x2e0a(){var _0x3df35a=['mti','getTime','prototype','546ZVVJKa','1789368inNyEH','344Mckxes','17910Gyqqne','genrand_int32','6390UApLuu','26lnIVPU','3282870ajXynZ','354320asRwXv','MATRIX_A','UPPER_MASK','148146KYYOQS','init_genrand','random','LOWER_MASK','521795mwClXA'];_0x2e0a=function(){return _0x3df35a;};return _0x2e0a();}var MersenneTwister=function(_0x2d2c7c){var _0x58692a=_0x571e;_0x2d2c7c==undefined&&(_0x2d2c7c=new Date()[_0x58692a(0xde)]()),this['N']=0x270,this['M']=0x18d,this[_0x58692a(0xe9)]=0x9908b0df,this[_0x58692a(0xea)]=0x80000000,this[_0x58692a(0xdb)]=0x7fffffff,this['mt']=new Array(this['N']),this['mti']=this['N']+0x1,this[_0x58692a(0xd9)](_0x2d2c7c);};MersenneTwister[_0x1ab4f1(0xdf)][_0x1ab4f1(0xd9)]=function(_0x4b2e85){var _0x2ac61c=_0x1ab4f1;this['mt'][0x0]=_0x4b2e85>>>0x0;for(this[_0x2ac61c(0xdd)]=0x1;this[_0x2ac61c(0xdd)]<this['N'];this[_0x2ac61c(0xdd)]++){var _0x4b2e85=this['mt'][this['mti']-0x1]^this['mt'][this[_0x2ac61c(0xdd)]-0x1]>>>0x1e;this['mt'][this[_0x2ac61c(0xdd)]]=(((_0x4b2e85&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x4b2e85&0xffff)*0x6c078965+this[_0x2ac61c(0xdd)],this['mt'][this['mti']]>>>=0x0;}},MersenneTwister[_0x1ab4f1(0xdf)]['genrand_int32']=function(){var _0x35eec8=_0x1ab4f1,_0x2b8916,_0x2927b6=new Array(0x0,this[_0x35eec8(0xe9)]);if(this[_0x35eec8(0xdd)]>=this['N']){var _0x35e004;if(this[_0x35eec8(0xdd)]==this['N']+0x1)this['init_genrand'](0x1571);for(_0x35e004=0x0;_0x35e004<this['N']-this['M'];_0x35e004++){_0x2b8916=this['mt'][_0x35e004]&this['UPPER_MASK']|this['mt'][_0x35e004+0x1]&this['LOWER_MASK'],this['mt'][_0x35e004]=this['mt'][_0x35e004+this['M']]^_0x2b8916>>>0x1^_0x2927b6[_0x2b8916&0x1];}for(;_0x35e004<this['N']-0x1;_0x35e004++){_0x2b8916=this['mt'][_0x35e004]&this[_0x35eec8(0xea)]|this['mt'][_0x35e004+0x1]&this['LOWER_MASK'],this['mt'][_0x35e004]=this['mt'][_0x35e004+(this['M']-this['N'])]^_0x2b8916>>>0x1^_0x2927b6[_0x2b8916&0x1];}_0x2b8916=this['mt'][this['N']-0x1]&this[_0x35eec8(0xea)]|this['mt'][0x0]&this[_0x35eec8(0xdb)],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x2b8916>>>0x1^_0x2927b6[_0x2b8916&0x1],this['mti']=0x0;}return _0x2b8916=this['mt'][this[_0x35eec8(0xdd)]++],_0x2b8916^=_0x2b8916>>>0xb,_0x2b8916^=_0x2b8916<<0x7&0x9d2c5680,_0x2b8916^=_0x2b8916<<0xf&0xefc60000,_0x2b8916^=_0x2b8916>>>0x12,_0x2b8916>>>0x0;},MersenneTwister[_0x1ab4f1(0xdf)][_0x1ab4f1(0xda)]=function(){var _0x4a6495=_0x1ab4f1;return this[_0x4a6495(0xe4)]()*(0x1/0x100000000);};