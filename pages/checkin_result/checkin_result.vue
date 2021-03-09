<template>
	<view class="page">
		<view class="summary-container">
			<view class="user-info">
				<image class="photo" :src="photo" mode="widthFix"></image>
				<view class="info">
					<text class="username">{{name}}</text>
					<text class="dept">所属部门:{{deptName == null?'无':deptName}}</text>
				</view>
			</view>
			<view class="date">{{date}}</view>
		</view>

		<view class="result-container">
			<view class="left">
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
				<view class="line"></view>
				<image src="../../static/icon-6.png" mode="widthFix" class="icon-timer"></image>
			</view>
			<view class="right">
				<view class="start">
					上班时间（时间 {{}})
				</view>
				<view class="checkin">签到时间（{{}})</view>
				<view class="address">
					<image class="icon-small" mode="widthFix" src="../../static/icon-7.png"></image>
					<text></text>
					<text></text>

				</view>
				<view class="face">
					<image class="icon-small" mode="widthFix" src="../../static/icon-8.png"></image>
					<text></text>
					<text></text>
				</view>
				<view class="end">下班时间（时间 {{}})</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				photo: "URL",
				date: "2020年12月1日",
				name: "无名氏",
				deptName: "",
			}
		}
	}
</script>

<style lang="less">
	@import url("checkin_result.less");
</style>
