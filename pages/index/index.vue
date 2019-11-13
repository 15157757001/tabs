<template>
	<view class="content">
		<!-- <cl-tabs :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" 
			:scale="1.3" ref="tabs0">
		</cl-tabs> -->
		<cl-tabs :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" 
			:scale="1.3" sliderColor="#faff72" type="float" ref="tabs1">
		</cl-tabs>
		<!-- <cl-tabs :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" 
			type="fill" sliderColor="#44cef6" selectColor="#70f3ff" ref="tabs2">
		</cl-tabs> -->
		<swiper 
			class="swiper" 
			:duration="300"
			@transition="transition"
			@change="changeCurrent" 
			:current="tabCurrentIndex"
			@animationfinish="animationfinish">
			
			<swiper-item v-for="(item,index) in tabBars" :key="index">
				{{index}}
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import clTabs from '@/components/cl-tabs/cl-tabs.vue'
	export default {
		components:{
			clTabs
		},
		data() {
			return {
				tabBars:['商品','商品','商品','商品','商品','商品'],
				tabCurrentIndex:-1,
				sysWidth:0,
				source:'touch',
				fristTouch:false
			}
		},
		onLoad() {
			this.sysWidth = uni.getSystemInfoSync().screenWidth
			//#ifndef H5
			this.fristTouch = true
			//#endif
		},
		mounted() {
			
			this.tabCurrentIndex = 1
		},
		methods: {
			tabChange(e){
				
				this.tabCurrentIndex = e
				
			},
			changeCurrent(e){
				this.source = e.detail.source
				
			},
			transition(e){
				if(this.source==''){
					
				}else{
					if(this.fristTouch){
						//this.$refs.tabs0.move(e.detail.dx-this.tabCurrentIndex*this.sysWidth)
						this.$refs.tabs1.move(e.detail.dx-this.tabCurrentIndex*this.sysWidth)
						//this.$refs.tabs2.move(e.detail.dx-this.tabCurrentIndex*this.sysWidth)
					}else{
						//this.$refs.tabs0.move(e.detail.dx)
						this.$refs.tabs1.move(e.detail.dx)
						//this.$refs.tabs2.move(e.detail.dx)
					}
				}
			},
			animationfinish(e){
				this.fristTouch = false
				this.source = 'touch'
				this.tabCurrentIndex = e.detail.current
				//this.$refs.tabs0.reset()
				this.$refs.tabs1.reset()
				//this.$refs.tabs2.reset()
			}
		}
	}
</script>

<style scoped>
.swiper{
	width: 750rpx;
	height: 500px;
}
	
</style>
