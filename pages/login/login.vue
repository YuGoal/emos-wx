<template>
	<view>
		<image src="../../static/logo-1.png" mode="widthFix" class="logo"></image>
		<view class="logo-title">EMOS企业在线办公系统</view>
		<view class="logo-subtitle">Ver 2050.2</view>
		<button class="login-btn" open-type="getUserInfo" @tap="login()">登录系统
		</button>
		<view class="register-container">没有账号？
			<text class="register" @tap="toRegister()">立即注册</text>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			toRegister: function() {
				uni.navigateTo({
					url: '../register/register'
				})
			},
			login: function() {
				let that = this;
				uni.showLoading({
					title:'登录中...'
				})
				uni.login({
					provider: 'weixin',
					success: function(resp) {
						let code = resp.code;
						console.log(code)
						that.ajax(that.url.login, 'POST', {
							"code": code
						}, function(resp) {
							let permission = resp.data.permission;
							uni.setStorageSync('permission',permission);
							//跳转到首页
							uni.switchTab({
								url:'../index/index'
							});
							uni.hideLoading();
						})
					},
					fail: (resp) => {
						uni.showToast({
							icon:'none',
							title:"执行异常"
						})
					}
				})
			}
		}
	}
</script>

<style class="less">
	@import url('login.less');
</style>
