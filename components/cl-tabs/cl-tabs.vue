<template>
	<view class="tabs">
		<scroll-view class="tab-bar" :scroll="false" scroll-x scroll-with-animation
			:show-scrollbar="false" :scroll-into-view="scrollInto">
			<view class="tab-box" id="tab-box" :style="{justifyContent: center?'center':'flex-start'}">
				<view v-for="(item,index) in tabBars" class="tab" @tap="tapTab(index)" :id="`tab_${index}`" ref="tab" :key="index" >
					<view :animation="animationData[index]" class="title" :id="`text_${index}`" :style="{color:index==tabIndex?selectColor:textColor,width:tabWidth}">{{item.tab||item}}</view>
				</view>
				<block v-if="type!='default'">
					<view :class="[type]" :animation="animationSlider" ref="slider" id="slider" :style="sliderBgColor+sliderPosition"></view>
				</block>
			</view>
		</scroll-view>
		
	</view>
	
</template>

<script>
	const sysWidth = uni.getSystemInfoSync().screenWidth
	export default{
		props:{
			tabBars:{
				type:Array,
				default:()=>[]
			},
			tabIndex: {
				type: Number,
				default: -1
			},
			scale: { //放大倍数
				type: Number,
				default: 1
			},
			type: { //类型fill文字被包含 float文字上浮 hang悬空
				type: String,
				default: 'default'
			},
			aniType:{ //动画类型  extend
				type: String,
				default: 'default'
			},
			sliderColor: { //滑块颜色
				type: String,
				default: '#ff461f'
			},
			textColor: { //字体颜色
				type: String,
				default: 'black'
			},
			selectColor:{ //选中字体颜色
				type: String,
				default: 'black'
			},
			sliderMargin:{ //延长滑块
				type: Number,
				default: 0
			},
			tabWidth:{ //tab宽度
				type: String,
				default: ''
			},
			center:{ //居中
				type: Boolean,
				default: false
			},
		},
		data(){
			return{
				animationData:{},
				largeAni:null,
				sliderAni:null,
				sliderAniEnd:null,
				animationSlider:{},
				sliderLeft:0,
				sliderRight:0,
				sliderWidth:0,//滑块宽度
				sliderMove:0,//滑块移动距离
				scrollInto:'',
				pos:0,
				direction:1
			}
		},
		created() {
			
			//放大动画
			this.largeAni = uni.createAnimation({duration:0});
			//滑块动画
			this.sliderAni = uni.createAnimation({duration:0});
			this.sliderAniEnd = uni.createAnimation({duration:100});
		},
		mounted() {
			
		},
		methods:{
			promise(time=0){
				let promise = new Promise((resolve,reject)=>{
					setTimeout(()=>{
						resolve()
					},time)
				})
				return promise
			},
			getDataByEl(el){
				let promise = new Promise((resolve,reject)=>{
					let tab = uni.createSelectorQuery().in(this)
					tab.select(el).boundingClientRect()
					tab.exec(async (tabData) => {
						resolve(tabData[0])
					})
				})
				return promise
			},
			//点击
			async tapTab(index){
				this.$emit('tabChange',index)
			},
			//触摸
			move(dx){
				//计算滑动index
				let ratio = dx/sysWidth
				
				//计算率
				let yRatio = dx%sysWidth/sysWidth
				
				//两边禁止
				if(this.tabIndex+ratio>=this.tabBars.length-1||this.tabIndex+ratio<=0) return
				
				
				if(this.aniType=='extend'){
					this.extendAni(ratio,yRatio)
				}else if(this.aniType=='default'){
					this.defaultAni(ratio,yRatio)
				}else if(this.aniType=='movExtend'){
					this.movExtendAni(ratio,yRatio)
					
				}
				
				this.textAni(ratio,yRatio)
				
				
				
			},
			defaultAni(ratio,yRatio){
				let yR = Math.abs(yRatio*2)>1?1:yRatio*2
				let translateX = this.sliderMove * ratio
				
				this.sliderAni.left(this.sliderLeft + translateX).step()
				this.animationSlider = this.sliderAni.export()
				
			},
			movExtendAni(ratio,yRatio){
				let yR = Math.abs(yRatio*2)>1?1:yRatio*2
				let maxTranslateX = this.sliderMove/2*ratio/Math.abs(ratio)
				let translateX = Math.abs(this.sliderMove * ratio)>Math.abs(maxTranslateX)?maxTranslateX:this.sliderMove * ratio
				let width = this.sliderWidth+this.sliderMove*Math.floor(Math.abs(ratio))+this.sliderMove*Math.abs(yR) - Math.abs(translateX)
				
				this.sliderAni.width(width).step()
				this.animationSlider = this.sliderAni.export()
				
				if(width+Math.abs(translateX)>this.sliderWidth+this.sliderMove) return
				
				this.sliderAni.translateX(translateX).step()
				this.animationSlider = this.sliderAni.export()
				if(ratio<0){
					this.direction = -1
					this.pos = sysWidth - this.sliderRight
				}else if(ratio>0){
					this.direction = 1
					this.pos = this.sliderLeft
				}
			},
			extendAni(ratio,yRatio){
				let yR = Math.abs(yRatio*2)>1?1:yRatio*2
				let width = this.sliderWidth+this.sliderMove*Math.floor(Math.abs(ratio))+this.sliderMove*Math.abs(yR)
				if(ratio<0){
					this.direction = -1
					this.pos = sysWidth - this.sliderRight
				}else if(ratio>0){
					this.direction = 1
					this.pos = this.sliderLeft
				}

				this.sliderAni.width(width).step()
				this.animationSlider = this.sliderAni.export()
			},
			textAni(ratio,yRatio){
				//取到结果值
				let currentIndex = ratio>0?Math.ceil(this.tabIndex+ratio):Math.floor(this.tabIndex+ratio)
				
				let scale = this.scale+(1-this.scale)*(Math.abs(yRatio)) < 1 ? 1:this.scale+(1-this.scale)*(Math.abs(yRatio))
				
				if(yRatio!=0){
					//复原
					this.largeAni.scale( scale ).step()
					this.animationData[currentIndex-(ratio>0?1:-1)] = this.largeAni.export()
					
					
					scale = 1-(1-this.scale)*(Math.abs(yRatio))>this.scale ? this.scale:1-(1-this.scale)*(Math.abs(yRatio))
					//放大
					this.largeAni.scale( scale ).step()
					this.animationData[currentIndex] = this.largeAni.export()
				}
			},
			async reset(newVal,oldVal){
				if(this.aniType=='movExtend'&&oldVal!=-1){
					if(newVal>oldVal){
						this.direction = -1
						this.pos = sysWidth - this.sliderRight -(newVal-oldVal)*this.sliderMove
					}else if(newVal<oldVal){
						this.direction = 1
						this.pos = this.sliderLeft + (newVal-oldVal)*this.sliderMove
					}
					await this.promise()
					this.sliderAni.width(this.sliderMove/2+this.sliderWidth).translateX(0).step()
					
					this.animationSlider = this.sliderAni.export()
				}
				
				
				let res = await this.getDataByEl('#tab-box')
				let tab = await this.getDataByEl(`#tab_${this.tabIndex}`)
				let tabData = await this.getDataByEl(`#text_${this.tabIndex}`)
				
				
				this.sliderLeft = tabData.left - res.left - this.sliderMargin/2
				this.sliderRight = tabData.right - res.left + this.sliderMargin/2
				this.sliderWidth = tabData.width + this.sliderMargin
				//滑块移动距离
				this.sliderMove = tab.width
	
				
				if(this.aniType=='default'){
					await this.promise()
					this.sliderAni.left(this.sliderLeft).step()
					this.animationSlider = this.sliderAni.export()
				}else if(this.aniType=='extend'||this.aniType=='movExtend'){
					if(oldVal==-1){
						this.pos = this.sliderLeft
						return
					}
					if(newVal>oldVal){
						this.direction = -1
						this.pos = sysWidth - this.sliderRight 
					}else if(newVal<oldVal){
						this.direction = 1
						this.pos = this.sliderLeft
					}
			
					this.sliderAniEnd.width(this.sliderWidth).step()
					this.animationSlider = this.sliderAniEnd.export()
				}
				
					
					
			
			}
		},
		watch:{
			tabBars:{
				immediate:true,
				handler(newVal,oldVal){
					for (var i = 0; i < newVal.length; i++) {
						let a = {}
						a[i] = {}
						this.animationData = {...this.animationData,...a}
					}
				}
			},
			tabIndex:{
				handler:async function(newVal,oldVal){
					
					for (let key in this.animationData) {
						if(key!=this.tabIndex){
							this.largeAni.scale( 1 ).step()
							this.animationData[key] = this.largeAni.export()
						}else{
							this.largeAni.scale( this.scale ).step()
							this.animationData[this.tabIndex] = this.largeAni.export()
						}
					}
					await this.promise()
					
					this.reset(newVal,oldVal)
					await this.promise(250)
					let scrollTab = newVal-2>0?newVal-2:0
					this.scrollInto = `tab_${scrollTab}`
				}
			},
		},
		computed:{
			sliderBgColor(){
				return `background-color:${this.sliderColor};width:${this.sliderWidth}px;`
			},
			sliderPosition(){
				let pos = this.direction > 0?`left:${this.pos}px;`:`right:${this.pos}px;`
				if(this.aniType=='default') pos=''
				return pos
			}
		}
	}
</script>

<style lang="scss" scoped>
.tabs{
	width: 750rpx;
	display: flex;
	flex-direction: row;
	padding: 0 0;
	align-items: center;
}
.tab{
	display: flex;
	white-space: nowrap;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 44px;
	padding: 0 30rpx;
	font-size: 16px;
	z-index: 99;
}
.title{
	text-align: center;
}
.tab-bar{
	width: 750rpx;
	height: 44px;
}
.tab-box{
	flex-direction: row;
	display: flex;
	position: relative;
	align-items: center;
}
.float{
	position: absolute;
	bottom: 6px;
	
	height: 20rpx;
	border-radius: 10rpx;
}
.fill{
	position: absolute;
	
	height: 25px;
	border-radius: 20rpx;
}
.hang{
	bottom: 3px;
	position: absolute;
	border-radius: 10rpx;
	height: 5px;
}
</style>
