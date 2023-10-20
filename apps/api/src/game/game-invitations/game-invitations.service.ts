import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { CreateGameInvitationDto } from './dto/create-game-invitation.dto';
import { MatchesStorage } from '../matches/matches.storage';
import { ChatService } from '@src/chat/chat.service';
import { GameInvitationsStorage } from './game-invitations.storage';
import { WebsocketService } from '@src/websocket/websocket.service';
import { RankService } from '../rank/rank.service';
import {
  GameInvitationData,
  MatchFoundData,
  ServerGameEvents,
} from '@transcendence/db';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class GameInvitationsService {
  constructor(
    private readonly matchesStorage: MatchesStorage,
    private readonly chatService: ChatService,
    private readonly gameInvitationStorage: GameInvitationsStorage,
    private readonly websocketService: WebsocketService,
    private readonly rankService: RankService,
    private readonly matchesService: MatchesService,
  ) {}

  async invite(user: ActiveUserData, data: CreateGameInvitationDto) {
    const isFriend = await this.chatService.isFriendOf(user, data.friendId);
    if (!isFriend) {
      throw new ForbiddenException('You can not invite this user');
    }
    const inGame = this.matchesStorage.isUserInGame(data.friendId);
    if (inGame) {
      throw new ForbiddenException('User In Game');
    }

    const profile = await this.rankService.getGameProfile(user, user.sub);
    const invitationId = await this.gameInvitationStorage.create({
      friendId: data.friendId,
      senderId: user.sub,
    });
    this.websocketService.addEvent(
      [data.friendId],
      ServerGameEvents.Invitation,
      {
        profile,
        invitationId,
      } satisfies GameInvitationData,
    );

    return { success: true };
  }

  async acceptInvitation(user: ActiveUserData, invitationId: string) {
    // user has friendId

    const invitation = await this.gameInvitationStorage.get(invitationId);
    if (!invitation) {
      throw new NotFoundException('Invitation expired');
    }

    const { friendId, senderId } = invitation;
    const isFriend = await this.chatService.isFriendOf(user, senderId);
    if (friendId !== user.sub || !isFriend) {
      throw new ForbiddenException('Invalid Invitation');
    }

    const match = await this.matchesService.create(friendId, senderId);
    this.websocketService.addEvent(
      [senderId, friendId],
      ServerGameEvents.MCHFOUND,
      { match } satisfies MatchFoundData,
    );
  }
}
