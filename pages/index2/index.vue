<template>
	<view class="content">
		<cl-tabs :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" :sliderMargin="20"
			type="fill" sliderColor="#E6FAFF" selectColor="#0cC5FD" ref="tabs2" class="tabs">
		</cl-tabs>
		
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
				tabBars:['最新','新闻','图片','视频','推荐','收藏','关注'],
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
						this.$refs.tabs2.move(e.detail.dx-this.tabCurrentIndex*this.sysWidth)
					}else{
						this.$refs.tabs2.move(e.detail.dx)
					}
				}
			},
			animationfinish(e){
				
				this.fristTouch = false
				this.source = 'touch'
				this.tabCurrentIndex = e.detail.current
			}
		}
	}
</script>

<style scoped>

.swiper{
	background-color: #F1F1F1;
	height: 600rpx;
}
	
</style>
