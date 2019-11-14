<template>
	<view class="tabs">
		<scroll-view class="tab-bar" :scroll="false" scroll-x :show-scrollbar="false" 
			:scroll-into-view="scrollInto">
			<view class="tab-box" id="scroll-box">
				<view v-for="(item,index) in tabBars" class="tab" @tap="tapTab(index)" ref="tab" :key="index" :id="`tab_${index}`">
					<view :animation="animationData[index]" class="title" :style="{color:index==tabIndex?selectColor:textColor}">{{item}}</view>
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
			type: { //类型fill文字被包含 float文字上浮
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
			}
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
			this.sliderAniEnd = uni.createAnimation({duration:80});
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
				
				//两边禁止缩小
				if(this.tabIndex+ratio>=this.tabBars.length-1||this.tabIndex+ratio<=0) return
				
				if(ratio<0){
					this.direction = -1
					this.pos = sysWidth - this.sliderRight
					this.sliderAni.width(this.sliderWidth+this.sliderMove*Math.abs(dx/sysWidth)).step()
					this.animationSlider = this.sliderAni.export()
				}else if(ratio>0){
					this.direction = 1
					this.pos = this.sliderLeft
					this.sliderAni.width(this.sliderWidth+this.sliderMove*Math.abs(dx/sysWidth)).step()
					this.animationSlider = this.sliderAni.export()
				}
				
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
				
				let res = await this.getDataByEl('#scroll-box')
				
				let tabData = await this.getDataByEl(`#tab_${this.tabIndex}`)
			
				this.sliderLeft = tabData.left - res.left
				this.sliderRight = tabData.right - res.left
				this.sliderWidth = tabData.width
				//滑块移动距离
				this.sliderMove = (tabData.left-tabData.width*this.tabIndex)/(2*this.tabIndex+1)*2+tabData.width
				if(oldVal==-1){
					this.pos = this.sliderLeft
					return
				}
				if(newVal>oldVal){
					this.direction = -1
					this.pos = sysWidth - this.sliderRight 
					this.sliderAniEnd.width(tabData.width).step()
					this.animationSlider = this.sliderAniEnd.export()
				}else if(newVal<oldVal){
					this.direction = 1
					this.pos = this.sliderLeft
					this.sliderAniEnd.width(tabData.width).step()
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
					this.scrollInto = `tab_${newVal}`
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
					
				}
			},
		},
		computed:{
			sliderBgColor(){
				return `background-color:${this.sliderColor};width:${this.sliderWidth}px;`
			},
			sliderPosition(){
				let pos = this.direction > 0?`left:${this.pos}px;`:`right:${this.pos}px;`
				
				return pos
			}
		}
	}
</script>

<style lang="scss" scoped>
.tabs{
	display: flex;
	flex-direction: row;
	padding: 20rpx 0;
	align-items: center;
}
.tab{
	display: flex;
	white-space: nowrap;

	padding: 10rpx 20px;
	font-size: 16px;
	z-index: 99;
}
.tab-bar{
	width: 750upx;
	height: 84upx;
	

}
.tab-box{
	flex-direction: row;
	display: flex;
	position: relative;
	align-items: center;
}
.float{
	position: absolute;
	bottom: 0;
	
	height: 20rpx;
	border-radius: 10rpx;
}
.fill{
	position: absolute;
	
	height: 44rpx;
	border-radius: 20rpx;
}
</style>
