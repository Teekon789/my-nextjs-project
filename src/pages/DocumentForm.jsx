"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const DocumentForm = () => {
    const router = useRouter();
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (router.query.id) {
            const fetchPost = async () => {
                try {
                    const { data } = await axios.get(`/api/createPost/${router.query.id}`);
                    setPost(data);
                } catch (error) {
                    console.error('Error fetching post:', error);
                }
            };
            fetchPost();
        }
    }, [router.query.id]);

    if (!post) {
        return <div>กำลังโหลดข้อมูล...</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatNumber = (num) => {
        return num?.toLocaleString('th-TH') || '0';
    };

    return (
        <div className="max-w-[800px] mx-auto p-8 bg-white font-sarabun">
            {/* Header Section */}
            <div className="grid grid-cols-2 border-b-2 border-black pb-4 text-sm mb-6">
                <div className="space-y-2">
                    <p>สัญญาเงินยืมเลขที่ {post.contract_number}</p>
                    <p>ชื่อผู้ยืม {post.fullname}</p>
                    <p>จำนวนเงิน {post.total_budget} บาท</p>
                </div>
                <div className="text-right space-y-2">
                    <p>วันที่ {post.date123}</p>
                    <p>หน้าที่ 1</p>
                    <p className="font-bold">แบบ 8708</p>
                </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold mb-6">ใบเบิกค่าใช้จ่ายในการเดินทางไปราชการ</h1>
                <div className="text-right">
                    <p className="mb-1">ที่ทำการ {post.department}</p>
                    <p>วันที่ {post.trip_date}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <p className="font-bold">เรื่อง ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการ</p>
                <p>ตามคำสั่ง/บันทึกที่ ......................... ลงวันที่ ...........................</p>
                
                <div className="pl-8 space-y-3">
                    <p>ข้าพเจ้า {post.fullname}</p>
                    <p>ตำแหน่ง {post.personnel_type}</p>
                    <p>สังกัด {post.department}</p>
                    <p className="mt-4">ขออนุมัติเบิกค่าใช้จ่ายในการเดินทางไปราชการดังรายการต่อไปนี้</p>

                    <div className="flex gap-8 my-6">
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="w-4 h-4 mr-2" checked={post.trip_type === 'บ้านพัก'} readOnly />
                            <span>บ้านพัก</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="w-4 h-4 mr-2" checked={post.trip_type === 'สำนักงาน'} readOnly />
                            <span>สำนักงาน</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="checkbox" className="w-4 h-4 mr-2" checked={post.trip_type === 'ประเทศไทย'} readOnly />
                            <span>ประเทศไทย</span>
                        </label>
                    </div>

                    <div className="space-y-2 pl-4">
                        <p>ออกเดินทางจากบ้านพัก/สำนักงาน วันที่ {post.departure_date}</p>
                        <p>กลับถึงบ้านพัก/สำนักงาน วันที่ {post.return_date}</p>
                        <p>รวมเวลาไปราชการครั้งนี้ {post.accommodation_days} วัน</p>
                    </div>
                </div>

                {/* Expenses Section */}
                <div className="pl-8 space-y-3 mt-6">
                    <p className="font-bold">ค่าใช้จ่ายในการเดินทางไปราชการ มีรายละเอียดดังนี้:</p>
                    <div className="pl-8 space-y-2">
                        <p>- ค่าเบี้ยเลี้ยงเดินทาง {post.accommodation_days} วัน รวม {post.allowance} บาท</p>
                        <p>- ค่าเช่าที่พักประเภท {post.accommodation_type} รวม {post.accommodation} บาท</p>
                        <p>- ค่าพาหนะ {post.transportation_type} รวม {post.transportation} บาท</p>
                        <p>- ค่าใช้จ่ายอื่น รวม {post.expenses} บาท</p>
                        <p className="font-bold mt-4">รวมทั้งสิ้น {post.total_budget} บาท</p>
                    </div>
                </div>

                {/* Signature Section */}
                <div className="text-right mt-16 space-y-2">
                    <p>ลงชื่อ ................................................</p>
                    <p>({post.fullname})</p>
                    <p>ตำแหน่ง {post.personnel_type}</p>
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-12">
                <Link href="/approval" passHref>
                    <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors">
                        กลับ
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default DocumentForm;