'use client';
import useCustomMove from "@/utils/useCustomMove";
import { getMembers, resetPassword, stopMember, startMember } from '../../api/memberApi';
import { Member, MemberListResponse } from '../../types/Member';
import { useEffect, useState } from "react";
import AccountRegisterModal from '@/components/AccountRegisterModal';
import { sweetAlert, sweetConfirm, sweetToast } from '@/utils/sweetAlert';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';

const initState = {
  memberRole: "",
  memberId: "",
  memberEmail: "",
};

interface StopParam {
  memberId: string;
  cancelReason: string;
}

// app/users/page.tsx
export default function UsersPage() {
    const users = [
      { id: 1, name: '홍길동', email: 'hong@example.com' },
      { id: 2, name: '김철수', email: 'kim@example.com' },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const {page, size, moveToList, moveToRefresh} = useCustomMove();
    const [searchParams, setSearchParams] = useState(initState);

    const [members, setMembers] = useState<Member[]>();

    // 공통 onChange 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const loadMembers = async () => {
      try {
        const data = await getMembers({ page, size, ...searchParams });
        setMembers(data);
      } catch (error) {
        console.log("멤버 데이터를 불러오는 중 에러 발생:", error);
        alert("서버 통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    };

    const handleReset = (memberId: string, email: string) => {
      sweetConfirm(`${memberId} 회원의 패스워드를 초기화 하시겠습니까?`, 'question', async () => {
        try {
          const data = await resetPassword(memberId);
          console.log(`data => ${JSON.stringify(data)}`);
    
          if (data.errorCode === 'notExist') {
            sweetAlert(data.errorMessage, '', 'info', '닫기');
            return;
          }
    
          sweetToast(`초기화된 패스워드가 ${email}로 전송되었습니다.`);
          //router.replace('/musics');
          //fetchMembers({
            //page: page,  // 검색은 항상 첫 페이지부터
            //size,
            //...searchParams
          //}).then(setMembers);
        } catch (error) {
          console.log("error=>" + JSON.stringify(error));
          alert("오류가 발생했습니다.");
        }
      });
    };
    
    const handleStop = (memberId: string) => {
    
      console.log(`memberId => ${memberId}`);
    
      sweetConfirm(`${memberId} 회원을 차단 하시겠습니까?`, 'question', async () => {
        const param: StopParam = {
          memberId,
          cancelReason: '관리자 요청'
        };
    
        try {
          const data = await stopMember(param);
          console.log(`data => ${JSON.stringify(data)}`);
    
          if (data.errorCode === 'notExist') {
            sweetAlert(data.errorMessage, '', 'info', '닫기');
            return;
          }
    
          sweetToast('회원이 차단 되었습니다.\n차단된 회원은 음악신청이 불가합니다.');
          //router.replace('/musics');
          getMembers({
            page: page,  // 검색은 항상 첫 페이지부터
            size,
            ...searchParams
          }).then(setMembers);
        } catch (error) {
          console.log("error=>" + JSON.stringify(error));
          alert("오류가 발생했습니다.");
        }
      });
    };

    const handleResume = (memberId: string) => {
    
      console.log(`memberId => ${memberId}`);
    
      sweetConfirm(`${memberId} 회원을 사용재개 하시겠습니까?`, 'question', async () => {
        const param: StopParam = {
          memberId,
          cancelReason: '관리자 요청'
        };
    
        try {
          const data = await startMember(param);
          console.log(`data => ${JSON.stringify(data)}`);
    
          if (data.errorCode === 'notExist') {
            sweetAlert(data.errorMessage, '', 'info', '닫기');
            return;
          }
    
          sweetToast('회원이 사용재개 되었습니다.\n음악신청 가능합니다.');
          //router.replace('/musics');
          getMembers({
            page: page,  // 검색은 항상 첫 페이지부터
            size,
            ...searchParams
          }).then(setMembers);
        } catch (error) {
          console.log("error=>" + JSON.stringify(error));
          alert("오류가 발생했습니다.");
        }
      });
    };
  
    useEffect(() => {
      loadMembers();
    }, [page, size]);

    useEffect(() => {
      console.log("members=>" + JSON.stringify(members));
    }, [members]);

    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4 text-white">계정 관리</h1>

        {/* 🔍 검색 폼 : 테두리 + 여백 + 정리된 UI */}
        <div className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
          <div className="grid grid-cols-1">
            <div className="flex justify-end">
              <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 flex items-center gap-1"> 
                ➕ 계정추가
              </button>
            </div>
          </div>
        </div>

        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table sx={{ minWidth: 1200 }} aria-label="Member Table">
            <TableHead>
              <TableRow>
                {['계정아이디', '신청곡 갯수', '등록일', '비밀번호', '차단'].map((title) => (
                  <TableCell key={title} align="center" sx={{ fontWeight: 'bold' }}>
                    {title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {members?.map((member: Member) => (
                <TableRow key={member.id}>
                  <TableCell align="center">{member.id}</TableCell>
                  <TableCell align="center">{member.numberOfSongRequests}</TableCell>
                  <TableCell align="center">{member.joinDate}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleReset(member.id, member.email)}
                    >
                      변경
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color={member.useYn === 'N' ? 'success' : 'error'}
                      size="small"
                      onClick={() => member.useYn === 'N' ? handleResume(member.id) : handleStop(member.id)}
                    >
                      {member.useYn === 'N' ? '해제' : '차단'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AccountRegisterModal visible={isModalOpen}  onRefresh={() => loadMembers()} onClose={() => setIsModalOpen(false)} />
      </div>
    );
  }
  