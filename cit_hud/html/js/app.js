$(document).ready(function () {
    window.addEventListener('message', function (event) {
        var message = event.data;

        if (message.action === 'toggle-ui') {
            if (message.toggle) {
                $('.main-wrapper').show();
            } else {
                $('.main-wrapper').hide();
            }

        } else if (message.action === 'update-guns') {

            if (message.hasWeapon != null && message.hasWeapon) {
                $('.guns').fadeIn();
                $('.clip-value').text(message.weaponClip);
                $('.remaining-value').text(message.weaponRemaining);
                $('.weapon-img').attr("src", "img/" + message.weaponName + ".png");
            } else {
                $('.guns').fadeOut();
            }

        } else if (message.action === 'update-health') {

            if (message.health != null && message.health) {
                $('.health-value').text(message.health);
                $('.health-value-max').text(message.maxHealth);
                $('#progress-health').css({ 'width': message.healthPercent + "%" });
            }

        } else if (message.action === 'update-armour') {

            if (message.armour != null && message.armour > 0) {
                $('.armour-value').text(message.armour);
                $('.armour-value-max').text(message.maxArmour);
                $('.armour').fadeIn();
                $('#progress-armour').css({ 'width': message.armourPercent + "%" });
            } else {
                $('.armour').fadeOut();
            }

        } else if (message.action === 'update-drugs') {

            let expireflash = 15;

            if (message.aspirin != null) {
				if (message.aspirin > 0) {
					$('.aspirin-value').text(message.aspirin);
					$('.aspirin').fadeIn();

					if (message.aspirin <= expireflash) {
						$('.aspirin').addClass('expiring');
					} else {
						$('.aspirin').removeClass('expiring');
					}
				}
				else {
					$('.aspirin').fadeOut();
				}
            }

            if (message.weed != null) {
				if (message.weed > 0) {
					$('.weed-value').text(message.weed);
					$('.weed').fadeIn();

					if (message.weed <= expireflash) {
						$('.weed').addClass('expiring');
					} else {
						$('.weed').removeClass('expiring');
					}
				}
				else {
					$('.weed').fadeOut();
				}
            }

            if (message.steroids != null) {
				if (message.steroids > 0) {
					$('.steroids-value').text(message.steroids);
					$('.steroids').fadeIn();

					if (message.steroids <= expireflash) {
						$('.steroids').addClass('expiring');
					} else {
						$('.steroids').removeClass('expiring');
					}
				}
				else {
					$('.steroids').fadeOut();
				}

            }
            if (message.lsd != null) {
				if (message.lsd > 0) {
					$('.lsd-value').text(message.lsd);
					$('.lsd').fadeIn();

					if (message.steroids <= expireflash) {
						$('.steroids').addClass('expiring');
					} else {
						$('.steroids').removeClass('expiring');
					}
				}
				else {
                $('.lsd').fadeOut();
				}
            }

        } else if (message.action === 'update-stats') {

            if (message.money != null && message.money) {
                $('.money-value').text(message.money.toLocaleString());
            }

            if (message.wantedPoints != null && message.wantedPoints > 0) {
                $('.wanted-value').text(message.wantedPoints.toLocaleString());
                $('.wanted-text').addClass('text-aspirin').removeClass('text-white');
            } else {
                $('.wanted-value').text(0);
                $('.wanted-text').addClass('text-white').removeClass('text-aspirin');
            }

            if (message.jobName != null && message.jobName) {
                $('.job-value').text(message.jobName);

                if ((message.jobColourR + message.jobColourG + message.jobColourB) > 0) {
                    $('.job-text').css({ 'color': "rgb(" + message.jobColourR + "," + message.jobColourG + "," + message.jobColourB + ")" });
                }
            }

        }
    });
});