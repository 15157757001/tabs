<template>
	<view class="content">
		<view class="top-box" :animation="animationData">
			<view class="top" :animation="animationTop">
				<view class="search">搜索</view>
			</view>
			<cl-tabs class="tabs" :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" :sliderMargin="15" 
				:scale="1.3" sliderColor="#faff72" type="float" ref="tabs0" aniType="extend">
			</cl-tabs>
		</view>
		
		<view style="height:44px"></view>
		<swiper 
			class="swiper"
			:style="{height: `${sysHeight-44}px`}" 
			:duration="300"
			@transition="transition"
			@change="changeCurrent" 
			:current="tabCurrentIndex"
			@animationfinish="animationfinish">
			
			<swiper-item v-for="(item,index) in tabBars" :key="index">
				<scroll-view scroll-y :scroll-top="scrollTop" class="scroll-Y tab-bar" @scroll="stickScroll($event,index)" :upper-threshold="10" @scrolltoupper="scrolltoupper($event,index)">
					<view style="height:40px"></view>
					<view class="scroll-box" v-for="count in 30" :key="count">{{count}}</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import clTabs from '@/components/cl-tabs/cl-tabs.vue'
	import sticky from './sticky.js'
	export default {
		mixins:[sticky],
		components:{
			clTabs
		},
		data() {
			return {
				tabBars:[
					{tab:'商品',scroll:0},
					{tab:'商品',scroll:0},
					{tab:'商品',scroll:0},
					{tab:'商品',scroll:0},
					{tab:'商品',scroll:0},
				],
				tabCurrentIndex:-1
			}
		},
		onLoad() {
			
		},
		mounted() {
			
			this.tabCurrentIndex = 1
		},
		methods: {
			tabChange(e){
				
				this.tabCurrentIndex = e
				
			}
		}
	}
</script>

<style scoped lang="scss">
.top-box{
	position: absolute;
	z-index: 10;
}
.top{
	height: 40px;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 0 20rpx;
	width: 710rpx;
}

.search{
	flex: 1;
	height: 30px;
	background-color: #f5f5f5;
	border-radius: 20px;
	padding: 0 20rpx;
	font-size: 14px;
	display: flex;
	align-items: center;
}

.swiper{
	position: relative;
	
}

.scroll-mask{
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.scroll-Y{
	width: 100%;
	height: 100%;
}
.scroll-box{
	margin: 20rpx;
	height: 40px;
}
</style>
