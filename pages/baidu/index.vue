<template>
	<view class="content">
		<cl-tabs :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" ref="tabs">
		</cl-tabs>
		<swiper 
			class="swiper" 
			@transition="touchMove"
			@change="changeCurrent" 
			:current="tabCurrentIndex"
			@animationfinish="animationfinish">
			
			<swiper-item>
				1
			
			</swiper-item>
			<swiper-item>
				2
			</swiper-item>
			<swiper-item>3
			</swiper-item>
			<swiper-item>4
			</swiper-item>
			<swiper-item>5
			</swiper-item>
			<swiper-item>6
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
				tabBars:['商品','商品','商品','商品','商品','商品','商品'],
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
			
			this.tabCurrentIndex = 3
		},
		methods: {
			tabChange(e){
				
				this.tabCurrentIndex = e
				
			},
			changeCurrent(e){
				this.source = e.detail.source
				
			},
			touchMove(e){
				if(this.source=='') return
				if(this.fristTouch){
					this.$refs.tabs.move(e.detail.dx-this.tabCurrentIndex*this.sysWidth)
				}else{
					this.$refs.tabs.move(e.detail.dx)
				}
				
			},
			animationfinish(e){
				this.fristTouch = false
				this.source = 'touch'
				this.tabCurrentIndex = e.detail.current
				this.$refs.tabs.reset()
			}
		}
	}
</script>

<style scoped>
.swiper{
	width: 750rpx;
	height: 200px;
}
	
</style>
