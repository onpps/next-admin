// app/member/UsersPageContent.tsx
'use client';

import { useCallback, useEffect, useState } from "react";
import useCustomMove from "@/utils/useCustomMove";
import AccountRegisterModal from '@/components/AccountRegisterModal';
import PasswordChangeForm from "@/components/PasswordChangeForm";
import { sweetAlert, sweetConfirm, sweetToast } from '@/utils/sweetAlert';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button
} from '@mui/material';
import CustomStepper from "@/components/CustomStepper";
import { getDeviceList, startDevice, stopDevice, changeNumberOfSongLimit } from '../../api/deviceApi';
import { Member } from '../../types/Member';

interface userParam {
  id: string;
  password: string;
}

interface limitParam {
  id: string;
  storeId : string;
  numberOfSongLimit: number;
}

export default function UsersPageContent() {
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [selectedLoginId, setSelectedLoginId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { page, size } = useCustomMove();
  const [members, setMembers] = useState<Member[]>();

  const loadDeviceList = useCallback(async () => {
    try {
      const data = await getDeviceList({ page, size });
      setMembers(data);
    } catch (error) {
      console.log("멤버 데이터를 불러오는 중 에러 발생:", error);
      alert("서버 통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [page, size]); 

  const handlePwChange = (memberId: string) => {
    setSelectedLoginId(memberId);
    setPwModalOpen(true);
  };

  const handleStop = (deviceId: string) => {
    sweetConfirm(`${deviceId} 계정을 차단 하시겠습니까?`, 'question', async () => {
      const param: userParam = { id: deviceId, password: '' };
      try {
        const data = await stopDevice(param);
        if (data.errorCode === 'notExist') {
          sweetAlert(data.errorMessage, '', 'info', '닫기');
          return;
        }
        sweetToast('계정이 차단 되었습니다.\n차단된 계정은 음악신청이 불가합니다.');
        loadDeviceList();
      } catch (error) {
        alert("오류발생:" + error);
      }
    });
  };

  const handleResume = (deviceId: string) => {
    sweetConfirm(`${deviceId} 계정을 사용재개 하시겠습니까?`, 'question', async () => {
      const param: userParam = { id: deviceId, password: '' };
      try {
        const data = await startDevice(param);
        if (data.errorCode === 'notExist') {
          sweetAlert(data.errorMessage, '', 'info', '닫기');
          return;
        }
        sweetToast('계정이 사용재개 되었습니다.\n음악신청 가능합니다.');
        loadDeviceList();
      } catch (error) {
        alert("오류발생:" + error);
      }
    });
  };

  const handleValueChange = async (memberId: string, storeId: string, newValue: number) => {
    console.log("memberId:", memberId);
    console.log("storeId:", storeId);  
    console.log("변경된 값:", newValue);

      const param: limitParam = { id: memberId, storeId: storeId, numberOfSongLimit: newValue };
      try {
        const data = await changeNumberOfSongLimit(param);
        console.log("data=>" + JSON.stringify(data));
        if (data.errorCode === 'notExist' || data.errorCode === 'authFail') {
          sweetAlert(data.errorMessage, '', 'info', '닫기');
          return;
        }
        sweetToast('신청가능 갯수가 수정되었습니다.');
        loadDeviceList();
      } catch (error) {
        alert("오류발생:" + error);
      }
  };

  useEffect(() => {
    loadDeviceList();
  }, [loadDeviceList]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 text-white">계정 관리</h1>

      <div className="border border-gray-300 rounded p-4 mb-6 bg-white shadow">
        <div className="grid grid-cols-1">
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 flex items-center gap-1"
            >
              ➕ 계정추가
            </button>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 1200 }} aria-label="Member Table">
          <TableHead>
            <TableRow>
              {['매장아이디', '계정아이디', '현재신청갯수', '신청가능갯수', '등록일', '비밀번호', '차단'].map((title) => (
                <TableCell key={title} align="center" sx={{ fontWeight: 'bold' }}>
                  {title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {members?.map((member: Member) => (
              <TableRow key={member.id}>
                <TableCell align="center">{member.storeId}</TableCell>
                <TableCell align="center">{member.id}</TableCell>
                <TableCell align="center">{member.numberOfSongRequests}</TableCell>
                <TableCell align="center">
                  <CustomStepper value={member.numberOfSongLimit} onChange={(newValue) => handleValueChange(member.id, member.storeId, newValue)} />
                </TableCell>
                <TableCell align="center">{member.joinDate}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handlePwChange(member.id)}
                  >
                    변경
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color={member.useYn === 'N' ? 'success' : 'error'}
                    size="small"
                    onClick={() =>
                      member.useYn === 'N' ? handleResume(member.id) : handleStop(member.id)
                    }
                  >
                    {member.useYn === 'N' ? '해제' : '차단'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AccountRegisterModal
        visible={isModalOpen}
        onRefresh={() => loadDeviceList()}
        onClose={() => setIsModalOpen(false)}
      />
      {pwModalOpen && selectedLoginId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-6">
            <PasswordChangeForm
              loginId={selectedLoginId}
              onClose={() => {
                setPwModalOpen(false);
                setSelectedLoginId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
