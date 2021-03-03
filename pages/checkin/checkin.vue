<template>
	<view>
		<camera device-position="back" flash="off" class="camera" @error="error" v-if="showCamera"></camera>
		<image mode="widthFix" class="camera" v-if="showImage" :src="photoPath"></image>
		<view class="operate-container">
			<button class="btn" type="primary" @tap="clickBtn()">{{btnText}}</button>
			<button class="btn" type="warn" @tap="afresh()">重拍</button>
		</view>
		<view class="notice-container">
			<text class="notice">注意事项</text>
			<text class="desc">拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外，拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度。</text>
		</view>
	</view>
</template>

<script>
	var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
	var qqmapsdk;
	export default {
		data() {
			return {
				canCheckin: true,
				photoPath: '',
				btnText: '拍照',
				showCamera: true,
				showImage: false,
			}
		},
		onLoad: function() {
			qqmapsdk = new QQMapWX({
				key: "H26BZ-A3BWP-QJ2D6-VJR47-PMCMQ-5LF6A"
			})
		},
		methods: {
			clickBtn: function() {
				let that = this;
				if (that.btnText == "拍照") {
					let ctx = wx.createCameraContext();
					ctx.takePhoto({
						quality: 'high',
						success: function(resp) {
							console.log(resp.tempImagePath)
							that.photoPath = resp.tempImagePath;
							that.btnText = "签到";
							that.showCamera = false;
							that.showImage = true;
						}
					})
				} else {
					//点击签到
					uni.showLoading({
						title: '签到中请稍后...'
					})
					setTimeout(function() {
						uni.hideLoading()
					}, 30000);
					uni.getLocation({
						type: "wgs84",
						success: function(resp) {
							let latitude = resp.latitude
							let longitude = resp.longitude
							qqmapsdk.reverseGeocoder({
								location: {
									latitude: latitude,
									longitude: longitude
								},
								success: function(resp) {
									console.log('请求成功' + resp.result.address)
									let address = resp.result.address
									let addressComponent = resp.result.address_component
									let nation = addressComponent.nation;
									let province = addressComponent.province;
									let city = addressComponent.city;
									let district = addressComponent.district;
									uni.uploadFile({
									    url: that.url.checkin,
									    filePath: that.photoPath,
									    name: 'photo',
									    header: {
									        token: uni.getStorageSync('token')
									    },
									    formData: {
									        address: address,
									        country: nation,
									        province: province,
									        city: city,
									        district: district
									    },
									    success: function(resp) {
									        // console.log(resp);
									        if (resp.statusCode == 500 && resp.data == '不存在人脸模型') {
									            uni.hideLoading();
									            uni.showModal({
									                title: '提示信息',
									                content: 'EMOS系统中不存在你的人脸识别模型，是否用当前这张照片作为人脸识别模型？',
									                success: function(res) {
									                    if (res.confirm) {
									                        //上传头像图片
									                        uni.uploadFile({
									                            url: that.url.createFaceModel,
									                            filePath: that.photoPath,
									                            name: 'photo',
									                            header: {
									                                token: uni.getStorageSync('token')
									                            },
									                            success: function(resp) {
									                                if (resp.statusCode == 500) {
									                                    uni.showToast({
									                                        title: resp.data,
									                                        icon: 'none'
									                                    });
									                                } 
									                                else if (resp.statusCode == 200) {
									                                    uni.showToast({
									                                        title: '人脸建模成功',
									                                        icon: 'none'
									                                    });
									                                }
									                            }
									                        });
									                    }
									                }
									            });
									        } 
									        else if (resp.statusCode == 200) {
									            let data = JSON.parse(resp.data);
									            let code = data.code;
									            let msg = data.msg;
									            if (code == 200) {
									                uni.hideLoading();
									                //签到成功
									                uni.showToast({
									                    title: '签到成功',
									                    complete: function() {
									                        //TODO 跳转到签到结果统计页面
									                    }
									                });
									            }
									        } 
									        else if (resp.statusCode == 500) {
									            uni.showToast({
									                title: resp.data,
									                icon: 'none'
									            });
									        }
									    }
									});
								},
								fail: function(res) {
									console.log('fail', res);
								},
							})
						}
					})
				}
			},
			afresh: function() {
				this.showCamera = true;
				this.showImage = false;
				this.btnText = '拍照';
			}
		}
	}
</script>

<style lang="less">
	@import url("checkin.less");
</style>
