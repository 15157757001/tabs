<template>
	<view class="content">
		<cl-tabs :tab-bars="tabBars" :tab-index="tabCurrentIndex" @tabChange="tabChange" center aniType="extend"
			type="hang" sliderColor="#FF6F00" textColor="#939393" selectColor="black" ref="tabs0" class="tabs"
			:sliderMargin="0" backgroundColor="#FAFAFA" :scale="1.2"
			>
		</cl-tabs>
		<view class="tabs-solid"></view>
		<swiper 
			class="swiper"
			:style="{height: `${sysHeight-45}px`}"
			:duration="300"
			@transition="transition"
			@change="changeCurrent" 
			:current="tabCurrentIndex"
			@animationfinish="animationfinish">
			
			<swiper-item v-for="(item,index) in tabBars" :key="index">
				<scroll-view scroll-y class="scroll-Y tab-bar">
					<!-- <refresh></refresh> -->
					<view class="scroll-box" v-for="count in 30" :key="count">{{count}}</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import clTabs from '@/components/cl-tabs/cl-tabs.vue'
	import tabs from './tabs.js'
	export default {
		mixins:[tabs],
		components:{
			clTabs
		},
		data() {
			return {
				tabBars:[
					{tab:'关注'},
					{tab:'新闻'},
				],
				tabCurrentIndex:-1
			}
		},
		onLoad() {
			
		},
		mounted() {
			//初始化设置index
			this.tabCurrentIndex = 1
		},
		methods: {
			//点击tab
			tabChange(e){
				
				this.tabCurrentIndex = e
				
			}
		}
	}
</script>

<style scoped lang="scss">
.tabs-solid{
	height: 1px;
	background-color: #D5D5D5;
}
.swiper{
	background-color: #fff;
	
}
.scroll-Y{
	width: 100%;
	height: 100%;
}
</style>
