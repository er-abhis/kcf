import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessengerService } from 'src/app/services/rest-services/messenger.service';
import { NotificationService } from 'src/app/utills/notification.service';
import { LocalstorageService } from 'src/app/utills/localstorage.service';
import { UserService } from 'src/app/services/rest-services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { interval } from 'rxjs/internal/observable/interval';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/internal/operators/take';
import { Subscription } from 'rxjs/internal/Subscription';
import { map, Subject } from "rxjs";

interface StateData {
  data: any,
  message: string
}
@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.scss'],
})
export class MessengerComponent implements OnInit, OnDestroy {
  welcome_name: any;
  firstName: any;
  lastName: any;
  messengerForm: any = FormGroup;
  chatRoomMessages: any = [];
  quickMessages: any = {
    Preschool: {
      'Schedule a tour':
        "Hello, I'm very interested in your program and would like to schedule a tour. Can you please share some dates and times that are available to tour your facility? Thank you.",
      'Follow up on application':
        'Hello, I am following up in regards to an application I submitted for your program. Can you please let me know the status and any next steps? Thank you.',
      'Confirm availability':
        'Hello, I am interested in your program and wanted to confirm you will have availability to start on (INSERT DESIRED START DATE). If so, please let me know and I can complete any required next steps. Thank you.',
      'Request phone call':
        'Hello, I am interested in your program and would like to discuss some additional details. Is someone from your team available this week or next for a phone call to share more? Thank you.',
      'Request additional information':
        'Hello, I am interested in your program and would like to request some additional information. Specifically, I would like to know (INSERT QUESTION(S) HERE). Please also share any additional details you may find helpful to a prospective family. Thank you.',
    },
  };
  provQuickActions: any = {
    Preschool: {
      'Invite to tour':
        "Hello! We would like to invite you to take a tour of our facility. Here are some dates and times we have available: (insert dates and times here). Please let us know if any of those work for you. We look foward to seeing you soon!",
      'Add to waitlist':
        'Hello! We have added you to our waitlist. You should receive a confirmation with your waitlist position. You will receive a notification once we have a space available.',
      'Invite to apply':
        'Hello! We would like to invite you to apply for our program for (child name). Click here to apply now.',
      'Invite to enroll':
        'Hello! We would like to invite you to enroll for our program for (child name). Click here to enroll now.'
    },
  };
  allChatRooms$: Subject<any> = new Subject<any>;
  messengerObservable = interval(30000);
  messengerSubscrtiption!: Subscription;
  newMessagesCount = 0;
  userDetails_id: any = null;
  @Output() public subsriptionChange = new EventEmitter();
  provider_id: any = null;
  user_type: any = null;
  msgLength: any;
  selectedChatRoomId: any = null;
  selectedUser: any = {};
  searchText = '';
  disabled: boolean = false;
  state$: Observable<object> | undefined;
  constructor(
    private messengerService: MessengerService,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private localstorageService: LocalstorageService,
    private userService: UserService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user_type = this.localstorageService.getUser().user_type;
    this.provider_id = this.localstorageService.getUser().provider_id;
    this.userDetails_id = this.localstorageService.getUser().userDetails_id;
    this.getAllChatRooms(true);
    this.initMessengerForm();
    this.refreshMessenger();
    // this.userDetailsIcon();
    this.handleNavigationFromManageWaitList();
  }

  refreshMessenger() {
    this.messengerSubscrtiption = this.messengerObservable.subscribe((val) => {
      this.getAllChatRooms(true);
      if (this.selectedChatRoomId) {
        this.getRoomMessages(this.selectedChatRoomId);
      }
    });
    this.subsriptionChange.emit(this.messengerSubscrtiption);
  }

  redirectCheck(userType: any, selectedId: any, id: any) {
    if (selectedId == this.selectedUser?.id) {
      this.goToProfile(userType, id);
    }
  }

  goToProfile(userType?: any, id?: any) {
    if (userType == 'PROVIDER') {
      if (id) {
        this.router.navigate(['/preschool', id]);
      } else this.router.navigate(['/preschool', this.selectedUser?.id]);
      this.localstorageService.saveKey('provider_return_text', 'message center')
    } else if (userType == 'USER') {
      if (id)
        this.router.navigate(['/user', id]);
      else
        this.router.navigate(['/user', this.selectedUser?.id]);
    } else if (this.user_type == 'USER') {
      this.localstorageService.saveKey('provider_return_text', 'message center')
      this.router.navigate(['/preschool', this.selectedUser?.id]);
    } else if (this.user_type == 'PROVIDER') {
      this.router.navigate(['/user', this.selectedUser?.user_account_id]);
    }
  }

  selectChatRoom(obj: any, chatRoomId: any) {
    this.messengerService.childArr = [];
    if (this.user_type == 'USER') {
      this.selectedUser = obj.provider;
      this.selectedUser.user_account_id = obj.user_account_id;
    }
    if (this.user_type == 'PROVIDER') {
      this.selectedUser = obj.user;
      this.selectedUser.user_account_id = obj.user_account_id;
      // this.getChildDetails(this.selectedUser.id)
    }
    this.selectedChatRoomId = chatRoomId;
    this.getRoomMessages(this.selectedChatRoomId, true);
  }

  initMessengerForm() {
    this.messengerForm = this.formBuilder.group({
      message: [''],
    });
  }

  userDetails(id: any) {
    this.userService.getUserById(id).subscribe({
      next: (res: any) => {
        this.selectedUser = res.data[0];
      },
      error: (error: any) => { },
    });
  }

  sendMessage() {
    let data: any = {};
    if (
      !this.messengerForm.value.message ||
      !this.messengerForm.value.message.trim()
    ) {
      return;
    }
    this.disabled = true;
    if (this.user_type == 'USER') {
      data = {
        provider: this.selectedUser?.id,
        user: this.userDetails_id,
        message: this.messengerForm.value.message,
        is_provider: false,
      };
    }
    if (this.user_type == 'PROVIDER') {
      data = {
        provider: this.provider_id,
        user: this.selectedUser?.id,
        message: this.messengerForm.value.message,
        is_provider: true,
      };
    }
    if (this.messengerService.childArr.length) {
      data.child_id = this.messengerService.childArr;
      this.messengerService.childArr = [];
    }
    this.messengerService.sendMessage(data).subscribe({
      next: (res: any) => {
        const data: any = res.data;
        if (!this.selectedChatRoomId) {
          this.selectedChatRoomId = data?.room_id;
        }
        this.getAllChatRooms();
        this.messengerForm.reset();
        this.disabled = false;
      },
      error: (error: any) => {
        this.disabled = false;

        this.notification.showError(error.error.errors.message[0]);
      },
    });
  }
  getChildDetails(data: any,type?: any) {
    if (data.length) {
      let arr: any = []
      data.map((item: any) => {
        if(type == 1){
        if (item.first_name?.length)
          arr.push(`${item.first_name}, age ${item.age}`)
        else if (!item.first_name.length && item?.expected_due_date) {
          arr.push(`Pregnancy (${item?.expected_due_date})`)
        }
        else
          return
        }
        else{
          if (item.first_name?.length && item.last_name?.length)
          arr.push(`${item.first_name} ${item.last_name}, ${item.age} ${item.age > 1?'years old':'year old'}`)
        else if (item.first_name?.length)
          arr.push(`${item.first_name}, ${item.age} ${item.age > 1?'years old':'year old'}`)
        else if (!item.first_name.length && !item.last_name?.length && item?.expected_due_date) {
          arr.push(`Pregnancy (${item?.expected_due_date})`)
        }
        else
          return
        }
      })
      return arr.join('; ')
    }
  }

  getRoomMessages(roomId: any, updateMsg?: boolean) {
    this.messengerService.roomMessages(roomId).subscribe({
      next: (res: any) => {
        this.chatRoomMessages = res.data;
        let msgObj = this.chatRoomMessages[this.chatRoomMessages.length - 1];
        if (this.user_type == 'USER' && updateMsg && !msgObj.is_read) {
          if (msgObj.is_provider) {
            this.messageUpdate(msgObj.id);
          }
        }
        if (this.user_type == 'PROVIDER' && updateMsg && !msgObj.is_read) {
          if (!msgObj.is_provider) {
            this.messageUpdate(msgObj.id);
          }
        }
      },
      error: (error: any) => { },
    });
  }
  messageUpdate(msgId: any) {
    let body = {
      room_id: this.selectedChatRoomId
    }
    this.messengerService.updateMessage(body, msgId).subscribe({
      next: (res: any) => {
        this.getAllChatRooms(false);
      },
      error: (error: any) => { },
    });
  }

  setQuickMessage(msg: any) {
    let text: any;
    if (
      this.selectedUser['provider-category'] == 'Preschool' ||
      this.selectedUser['provider_type'] == 'PRE_SCHOOL' ||
      this.localstorageService.getUser()?.provider_category == 13
    ) {
      text = this.quickMessages.Preschool[msg];
    }
    else
    text = this.quickMessages.Preschool[msg];

    this.messengerForm.controls.message.patchValue(text);
  }
  setProvQuickActions(msg: any) {
    let text: any;
    if (
      this.selectedUser['provider-category'] == 'Preschool' ||
      this.selectedUser['provider_type'] == 'PRE_SCHOOL' ||
      this.localstorageService.getUser()?.provider_category == 13
    ) {
      text = this.provQuickActions.Preschool[msg];
    }
    else
    text = this.provQuickActions.Preschool[msg];

    this.messengerForm.controls.message.patchValue(text);
  }

  getAllChatRooms(updateMsg?: boolean) {
    let data: any = {};
    if (this.user_type == 'USER') {
      data.user_id = this.userDetails_id;
    }
    if (this.user_type == 'PROVIDER') {
      data.provider_id = this.provider_id;
    }
    this.messengerService.allrooms(data).subscribe({
      next: (res: any) => {
        if (this.messengerService.user?.id) {
          this.selectedUser = this.messengerService.user;
          // if(this.user_type == 'PROVIDER')
          // this.getChildDetails(this.selectedUser.id)
          this.allChatRooms$.subscribe(value => {
            value.forEach((element: any) => {
              if ((element.user?.id == this.messengerService.user?.id) && this.user_type == 'PROVIDER') {
                this.selectedChatRoomId = element.room_id;
                this.selectedUser = element.user;
                this.selectedUser.user_account_id = element.user_account_id;
                this.getRoomMessages(this.selectedChatRoomId, updateMsg);
                this.messengerService.user = null;
              }
              if ((element.provider?.id == this.messengerService.user?.id) && this.user_type == 'USER') {
                this.selectedUser = element.provider;
                this.selectedChatRoomId = element.room_id;
                this.selectedUser.user_account_id = element.user_account_id;
                this.getRoomMessages(this.selectedChatRoomId, updateMsg);
                this.messengerService.user = null;
              }
            });
          });
          // this.userDetails(this.messengerService.user?.id);
        }
        this.allChatRooms$.next(res.data?.rooms);
        this.msgLength = res.data?.rooms.length

        this.newMessagesCount = res.data?.new_messages;
        this.userService.newMsgCount = this.newMessagesCount;
        if (this.selectedChatRoomId) {
          this.getRoomMessages(this.selectedChatRoomId, updateMsg);
        }
      },
      error: (error: any) => { },
    });
  }
  ngOnDestroy() {
    this.messengerService.user = null;
  }

  userDetailsIcon() {
    let id = this.localstorageService.getUser().id;
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        // this.firstName = data.data[0].userDetails.first_name;
        // this.lastName = data.data[0].userDetails.last_name;
        this.welcome_name = data.data?.[0].userDetails.first_name[0];
      },
    });
  }

  handleNavigationFromManageWaitList() {
    this.state$ = this.activatedRoute.paramMap.pipe(map(() => window.history.state));
    this.state$.subscribe((e: any) => {
      const state: StateData = e;
      if (state?.data?.user?.parent_1?.id) {
        this.allChatRooms$.subscribe((allChatRooms) => {
          const chatRoom = allChatRooms.filter((chatRoom: any) => chatRoom.user.id === state.data.user.parent_1.id);
          this.selectChatRoom(chatRoom[0], chatRoom[0].room_id);
        });
        this.messengerForm.patchValue({ message: state.message })
      }
    });
  }
  hideSidebar() {
    let leftPanel: any = document.getElementsByClassName('messageRhode')[0];
    leftPanel.style.display = 'none';
  }
}
