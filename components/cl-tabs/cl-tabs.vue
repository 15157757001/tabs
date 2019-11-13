<template>
	<view class="tabs">
		<scroll-view class="tab-bar" :scroll="false" scroll-x :show-scrollbar="false" 
			:scroll-into-view="scrollInto" @scroll="scroll">
			<view class="scroll-box">
				<view v-for="(item,index) in tabBars" class="tab" @tap="tapTab(index)" ref="tab" :key="index" :id="`tab_${index}`">
					<view :animation="animationData[index]" class="title" :style="{color:index==tabIndex?selectColor:textColor}">{{item}}</view>
				</view>
				<block v-if="type!='default'">
					<view :class="[type]" :animation="animationSliderLeft" ref="slider" id="slider" :style="{backgroundColor:sliderColor}"></view>
					<view :class="[type]" :animation="animationSliderRight" ref="sliderRight" id="sliderRight" :style="{backgroundColor:sliderColor}"></view>
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
				sliderAniRight:null,
				sliderAniEnd:null,
				sliderAniRightEnd:null,
				animationSliderLeft:{},
				animationSliderRight:{},
				sliderLeft:0,
				sliderRight:0,
				sliderWidth:0,//滑块宽度
				sliderMove:0,//滑块移动距离
				scrollInto:'',
				scrollLeft:0
			}
		},
		created() {
			
			//放大动画
			this.largeAni = uni.createAnimation({duration:0});
			//滑块动画
			this.sliderAni = uni.createAnimation({duration:0});
			this.sliderAniRight = uni.createAnimation({duration:0});
			this.sliderAniEnd = uni.createAnimation({duration:80});
			this.sliderAniRightEnd = uni.createAnimation({duration:80});
			this.sliderAniRightQuick = uni.createAnimation({duration:0});
			this.sliderAniQuick = uni.createAnimation({duration:0});
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
			scroll({detail}){
				this.scrollLeft = detail.scrollLeft
				this.reset(this.tabIndex,this.tabIndex)
			},
			//点击
			async tapTab(index){
				this.$emit('tabChange',index)
				await this.promise()
				for (let key in this.animationData) {
					if(key!=this.tabIndex){
						this.largeAni.scale( 1 ).step()
						this.animationData[key] = this.largeAni.export()
					}else{
						this.largeAni.scale( this.scale ).step()
						this.animationData[this.tabIndex] = this.largeAni.export()
					}
				}
				this.reset(this.tabIndex,this.tabIndex)
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
					this.sliderAni.left(this.sliderLeft+this.scrollLeft).width(this.sliderWidth).step()
					this.animationSliderLeft = this.sliderAni.export()
					
					this.sliderAniRight.right(sysWidth-this.sliderRight-this.scrollLeft).width(this.sliderWidth+this.sliderMove*Math.abs(dx/sysWidth)).step()
					this.animationSliderRight = this.sliderAniRight.export()

				}else if(ratio>0){
					this.sliderAniRight.right(sysWidth-this.sliderRight-this.scrollLeft).width(this.sliderWidth).step()
					this.animationSliderRight = this.sliderAniRight.export()
					
					
					this.sliderAni.left(this.sliderLeft+this.scrollLeft).width(this.sliderWidth+this.sliderMove*Math.abs(dx/sysWidth)).step()
					this.animationSliderLeft = this.sliderAni.export()
					
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
			reset(newVal,oldVal){
				
				
				let tab = uni.createSelectorQuery().in(this)
				tab.select(`#tab_${this.tabIndex}`).boundingClientRect()
				tab.exec(async (tabData) => {
					
					this.sliderWidth = tabData[0].width
					//滑块移动距离
					this.sliderMove = (tabData[0].left-tabData[0].width*this.tabIndex)/(2*this.tabIndex+1)*2+tabData[0].width
					
					if(newVal>oldVal){
						this.sliderAni.left(tabData[0].left+this.scrollLeft).width(tabData[0].width).step()
						this.animationSliderLeft = this.sliderAni.export()
						
						this.sliderAniRight.right(sysWidth-tabData[0].right-this.scrollLeft).width(tabData[0].width).step()
						this.animationSliderRight = this.sliderAniRight.export()
						// await this.promise(80)
						// this.sliderAni.width(tabData[0].width).step()
						// this.animationSliderLeft = this.sliderAni.export()
						// this.sliderAniRightEnd.right(sysWidth-tabData[0].right).width(tabData[0].width).step()
						// this.animationSliderRight = this.sliderAniRightEnd.export()
					}else if(newVal<oldVal){
						
						
						this.sliderAniRight.right(sysWidth-tabData[0].right-this.scrollLeft).width(tabData[0].width).step()
						this.animationSliderRight = this.sliderAniRight.export()
					
						this.sliderAni.left(tabData[0].left+this.scrollLeft).width(tabData[0].width).step()
						this.animationSliderLeft = this.sliderAni.export()
					
						// await this.promise(80)
						// this.sliderAniRight.width(tabData[0].width).step()
						// this.animationSliderRight = this.sliderAni.export()
						// this.sliderAniEnd.left(tabData[0].left).width(tabData[0].width).step()
						// this.animationSliderLeft = this.sliderAniEnd.export()
					}else if(newVal==oldVal){
						this.sliderAniRightQuick.right(sysWidth-tabData[0].right-this.scrollLeft).width(tabData[0].width).step()
						this.animationSliderRight = this.sliderAniRightQuick.export()
											
						this.sliderAniQuick.left(tabData[0].left+this.scrollLeft).width(tabData[0].width).step()
						this.animationSliderLeft = this.sliderAniQuick.export()
					}
					if(this.type=='default') return
					await this.promise()
					
					let dom = uni.createSelectorQuery().in(this)
					dom.select("#slider").boundingClientRect()
					dom.exec((domData) => {
						this.sliderLeft = domData[0].left
						this.sliderRight = domData[0].right
							
					})
					
				})
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
					
				}
			},
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
.scroll-box{
	flex-direction: row;
	display: flex;
	position: relative;
}
.float{
	position: absolute;
	bottom: 0;
	height: 20rpx;
	border-radius: 10rpx;
}
.fill{
	position: absolute;
	bottom: 10rpx;
	height: 44rpx;
	border-radius: 20rpx;
}
</style>
