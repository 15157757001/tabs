const sysWidth = uni.getSystemInfoSync().windowWidth
const sysHeight = uni.getSystemInfoSync().windowHeight
export default{
	data(){
		return{
			source:'touch',
			fristTouch:false,
			sysHeight:'',
			stickyAni:null,
			animationData:{},
			animationTop:{},
			topAni:null,
			scrollTop:0,
			scrollArr:[]
		}
		
	},
	created(){
		this.sysHeight = uni.getSystemInfoSync().windowHeight
		//#ifndef H5
		this.fristTouch = true
		//#endif
		this.stickyAni = uni.createAnimation({duration:0});
		this.topAni = uni.createAnimation({duration:0});
	},
	methods:{
		changeCurrent(e){
			this.source = e.detail.source
			
		},
		transition(e){
			if(this.source==''){
				
			}else{
				if(this.fristTouch){
					this.$refs.tabs0.move(e.detail.dx-this.tabCurrentIndex*sysWidth)
				}else{
					this.$refs.tabs0.move(e.detail.dx)
				}
			}
		},
		animationfinish(e){
			
			this.fristTouch = false
			this.source = 'touch'
			this.tabCurrentIndex = e.detail.current
		},
		stickScroll(e,index){
			let scrollTop = e.detail.scrollTop >= 40? 40: e.detail.scrollTop
			if(index==this.tabCurrentIndex){
				this.stickyAni.top(-scrollTop).step()
				this.animationData = this.stickyAni.export()
				this.topAni.opacity(1-scrollTop/40*2).step()
				this.animationTop = this.topAni.export()
				this.tabBars[index].scroll = e.detail.scrollTop - scrollTop
				this.scrollTop = scrollTop
				this.scrollArr.push(e.detail.scrollTop)
			}
			
			
		},
		scrolltoupper(e,index){
			
			if(index==this.tabCurrentIndex){
				this.stickyAni.top(0).step()
				this.animationData = this.stickyAni.export()
				this.topAni.opacity(1).step()
				this.animationTop = this.topAni.export()
				this.tabBars[index].scroll = 0
				this.scrollTop = 0
				this.scrollArr = []
			}
			
		}
	},
	watch:{
		scrollArr(newVal,oldVal){
		
			if(2*newVal[newVal.length-2]>newVal[newVal.length-3] + newVal[newVal.length-1] 
				&& newVal[newVal.length-2]>newVal[newVal.length-1] 
				&& newVal[newVal.length-3]>newVal[newVal.length-2] ){
				setTimeout(() => {
					this.scrollTop = 1
				}, 300);
				
			}
			
		}
	}
	
}