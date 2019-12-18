<template>
	<view class="page">
		<view class="box" @tap="tapBox('default')">默认 <text>></text></view>
		<view class="box" @tap="tapBox('float')">上浮定宽 <text>></text></view>
		<view class="box" @tap="tapBox('fill')">包含 <text>></text></view>
		<view class="box" @tap="tapBox('hang')">悬浮居中 <text>></text></view>
		<view class="box" @tap="tapBox('sticky')">吸顶(tabs+swiper+scrollView) <text>></text></view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				number:5
			}
		},
		methods:{
			tapBox(urlName){
				uni.navigateTo({
					url:`${urlName}/${urlName}`
				})
				
			}
		}
	}
</script>

<style>
	.page{
		display: flex;
		flex-direction: column;
	}
	.box{
		flex: 1;
		
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 20rpx;
		border-bottom: 1px solid #ccc;
	}
</style>
