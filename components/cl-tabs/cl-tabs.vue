<template>
	<view>
		<view class="tabs">
			<view v-for="(item,index) in tabBars" class="tab" @tap="tapTab(index)" ref="tab" :key="index" :id="`tab_${index}`">
				<view :animation="animationData[index]" class="title">{{item}}</view>
			</view>
			<view class="slider" :animation="animationSlider" ref="slider" id="slider"></view>
			<view class="slider" :animation="animationSliderRight" ref="sliderRight" id="sliderRight"></view>
		</view>
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
			scale: {
				type: Number,
				default: 1.3
			},
		},
		data(){
			return{
				animationSlider:{},
				animationData:{},
				largeAni:null,
				sliderAni:null,
				sliderAniRight:null,
				animationSliderRight:{},
				sliderLeft:0,
				sliderRight:0,
				sliderWidth:0,//滑块宽度
				sliderMove:0,//滑块移动距离
			}
		},
		created() {
			
			//放大动画
			this.largeAni = uni.createAnimation({
				duration:0
			});
			//滑块动画
			this.sliderAni = uni.createAnimation({
				duration:0,
				transformOrigin:"50 50 0"
			});
			this.sliderAniRight = uni.createAnimation({
				duration:0,
				transformOrigin:"50 50 0"
			});
		},
		mounted() {
			
		},
		methods:{
			promise(){
				let promise = new Promise((resolve,reject)=>{
					setTimeout(()=>{
						resolve()
					},0)
				})
				return promise
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
					this.sliderAniRight.right(sysWidth-this.sliderRight).step()
					this.animationSliderRight = this.sliderAniRight.export()
					this.sliderAniRight.width(this.sliderWidth+this.sliderMove*Math.abs(dx/sysWidth)).step()
					this.animationSliderRight = this.sliderAniRight.export()
				}else{
					this.sliderAni.left(this.sliderLeft).step()
					this.animationSlider = this.sliderAni.export()
					this.sliderAni.width(this.sliderWidth+this.sliderMove*Math.abs(dx/sysWidth)).step()
					this.animationSlider = this.sliderAni.export()
				}
				
				//取到结果值
				let currentIndex = ratio>0?Math.ceil(this.tabIndex+ratio):Math.floor(this.tabIndex+ratio)
				
				let scale = this.scale+(1-this.scale)*(Math.abs(yRatio)) < 1 ? 1:this.scale+(1-this.scale)*(Math.abs(yRatio))
				
				if(yRatio==0) return
				//复原
				this.largeAni.scale( scale ).step()
				this.animationData[currentIndex-(ratio>0?1:-1)] = this.largeAni.export()
				
				
				scale = 1-(1-this.scale)*(Math.abs(yRatio))>this.scale ? this.scale:1-(1-this.scale)*(Math.abs(yRatio))
				//放大
				this.largeAni.scale( scale ).step()
				this.animationData[currentIndex] = this.largeAni.export()
				
			},
			reset(){
				
				
				let tab = uni.createSelectorQuery().in(this)
				tab.select(`#tab_${this.tabIndex}`).boundingClientRect()
				tab.exec(async (tabData) => {
					
					this.sliderWidth = tabData[0].width
					//滑块移动距离
					this.sliderMove = (tabData[0].left-tabData[0].width*this.tabIndex)/(2*this.tabIndex+1)*2+tabData[0].width
					
					this.sliderAni.left(tabData[0].left).step()
					this.animationSlider = this.sliderAni.export()
					this.sliderAni.width(tabData[0].width).step()
					this.animationSlider = this.sliderAni.export()
					
					this.sliderAniRight.right(sysWidth-tabData[0].right).step()
					this.animationSliderRight = this.sliderAniRight.export()
					this.sliderAniRight.width(tabData[0].width).step()
					this.animationSliderRight = this.sliderAniRight.export()
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
					if(oldVal==-1){
						for (let key in this.animationData) {
							if(key!=this.tabIndex){
								this.largeAni.scale( 1 ).step()
								this.animationData[key] = this.largeAni.export()
							}else{
								this.largeAni.scale( this.scale ).step()
								this.animationData[this.tabIndex] = this.largeAni.export()
							}
						}
					}
					await this.promise()
					this.reset()
					
				}
			},
		}
	}
</script>

<style lang="scss">
.tabs{
	display: flex;
	flex-direction: row;
	padding: 20rpx;
	align-items: center;
	position: relative;
}
.tab{
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	margin:20rpx 20rpx;
	width: 50px;
	font-size: 16px;
	z-index: 99;
}
.slider{
	position: absolute;
	bottom: 30rpx;
	background-color: #FFF82B;
	width: 50px;
	height: 20rpx;
	border-radius: 10rpx;
}
</style>
