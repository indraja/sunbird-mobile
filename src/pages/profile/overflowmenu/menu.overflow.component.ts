import { IonicPage } from "ionic-angular/navigation/ionic-page";
import { Component } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { UsersnClassesComponent } from "../usersnclasses/usersnclass.component";
import { ToastController, App } from "ionic-angular";
import { SettingsPage } from "../../settings/settings";
import { OAuthService } from "sunbird";
import { OnboardingPage } from "../../onboarding/onboarding";
import { Interact, InteractType, InteractSubtype, PageId, Environment, TelemetryService } from "sunbird";
import { generateInteractEvent } from "../../../app/telemetryutil";

@Component({
    selector: 'menu-overflow',
    templateUrl: 'menu.overflow.html'
})

export class OverflowMenuComponent {
    items: Array<string>;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private toastCtrl: ToastController,
        private oauth: OAuthService,
        private telemetryService: TelemetryService,
        private app: App
    ) {
        this.items = this.navParams.get("list");
    }

    showToast(toastCtrl: ToastController, message: String) {

    }

    close(event, i) {
        this.viewCtrl.dismiss(JSON.stringify({
            "content": event.target.innerText,
            "index": i
        }));
        switch (i) {
            // case 0: {
            //     this.navCtrl.push(UsersnClassesComponent);
            //     break;
            // }
            // case 1: {
            //     let toast = this.toastCtrl.create({
            //         message: 'Download Manager functionality is under progress',
            //         duration: 3000,
            //         position: 'bottom'
            //       });
            //       toast.present();
            //     break;
            // }
            case 0: {
                this.generateInteractEvent();
                this.app.getActiveNav().push(SettingsPage);
                break;
            }
            case 1: {
                // let toast = this.toastCtrl.create({
                //     message: 'Sign Out functionality is under progress',
                //     duration: 3000,
                //     position: 'bottom'
                //   });
                //   toast.present();
                let valuesMap = new Map();
                valuesMap["UID"] = "";
                this.telemetryService.interact(
                    generateInteractEvent(InteractType.TOUCH,
                        InteractSubtype.LOGOUT_INITIATE,
                        Environment.HOME,
                        PageId.LOGOUT,
                        valuesMap));

                this.oauth.doLogOut();
                this.navCtrl.setRoot(OnboardingPage);
                this.telemetryService.interact(
                    generateInteractEvent(InteractType.OTHER,
                        InteractSubtype.LOGOUT_SUCCESS,
                        Environment.HOME, PageId.LOGOUT,
                        valuesMap));
                break;
            }

        }
    }

    generateInteractEvent() {
        let interact = new Interact();
        interact.type = InteractType.TOUCH;
        interact.subType = InteractSubtype.SETTINGS_CLICKED;
        interact.pageId = PageId.PROFILE;
        interact.id = PageId.PROFILE;
        interact.env = Environment.USER;
        this.telemetryService.interact(interact);
    }

}