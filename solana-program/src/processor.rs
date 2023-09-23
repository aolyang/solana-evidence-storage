use std::borrow::Borrow;
use crate::error::Error;
use crate::state::EvidenceAccountState;
use borsh::BorshSerialize;
use solana_program::{
    account_info::next_account_info,
    borsh0_10::try_from_slice_unchecked,
    program::invoke_signed,
    program_error::ProgramError,
    program_pack::IsInitialized,
    system_instruction,
    sysvar::rent::Rent,
    sysvar::Sysvar,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey
};

pub fn add_evidence_stats(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    file_name: String,
    description: String,
    size: u64,
    hash: String,
) -> ProgramResult {
    msg!("正在添加证据信息...");
    msg!("文件名称: {}", file_name);
    msg!("描述: {}", description);
    msg!("文件大小: {}", size);
    msg!("文件hash: {}", hash);

    // 获取账户迭代器
    let account_info_iter = &mut accounts.iter();

    // 获取账户
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    // add check here
    if !initializer.is_signer.clone() {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // 构造PDA账户
    let (pda, bump_seed) =
        Pubkey::find_program_address(&[initializer.key.as_ref(), file_name.as_bytes()], program_id);

    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(ProgramError::InvalidArgument);
    }

    // 计算所需的账户大小
    let total_len: usize = 1 + 1 + (4 + file_name.len()) + (4 + description.len());
    if total_len > 1000 {
        msg!("Data length is larger than 1000 bytes");
        return Err(Error::InvalidDataLength.into());
    }

    // 计算所需资金
    let rent = &Rent::from_account_info(next_account_info(account_info_iter)?)?;
    let required_lamports = rent.minimum_balance(total_len);

    // 创建账户
    invoke_signed(
        &system_instruction::create_account(
            initializer.key,
            pda_account.key,
            required_lamports,
            total_len.try_into().map_err(|_| Error::ConvertUsizeToU64Failed)?,
            program_id,
        ),
        &[initializer.clone(), pda_account.clone(), system_program.clone()],
        &[&[initializer.key.as_ref(), &[bump_seed]]],
    )?;

    msg!("解包状态账户");
    let mut account_data =
        try_from_slice_unchecked::<EvidenceAccountState>(&pda_account.data.borrow()).unwrap();

    msg!("序列化状态账户");
    account_data.file_name = file_name;
    account_data.description = description;
    account_data.size = size;
    account_data.hash = hash;
    account_data.is_initialized = true;
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    Ok(())
}

pub fn update_evidence_info(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    file_name: String,
    description: String,
) -> ProgramResult {
    msg!("Updating evidence review...");
    msg!("Update evidence is : {}", file_name);
    msg!("update evidence({}) description to {}", file_name, description);

    // Get Account iterator
    let account_info_iter = &mut accounts.iter();

    // Get accounts
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;

    if !initializer.is_signer.clone() {
        msg!("Missing required signature");
        return Err(ProgramError::MissingRequiredSignature);
    }

    if pda_account.owner != program_id {
        return Err(ProgramError::IllegalOwner);
    }

    msg!("unpacking state account");
    let mut account_data =
        try_from_slice_unchecked::<EvidenceAccountState>(&&pda_account.data.borrow()).unwrap();
    msg!("borrowed account data");

    // Derive PDA and check that it matches client
    let (pda, _bump_seed) = Pubkey::find_program_address(
        &[initializer.key.as_ref(), account_data.file_name.as_bytes()],
        program_id,
    );

    if pda != *pda_account.key {
        msg!("Invalid seeds for PDA");
        return Err(Error::InvalidPDA.into());
    }

    if !account_data.is_initialized() {
        msg!("Account is not initialized");
        return Err(Error::UninitializedAccount.into());
    }


    let total_len: usize = 1 + 1 + (4 + account_data.file_name.len()) + (4 + description.len());
    if total_len > 1000 {
        msg!("Data length is larger than 1000 bytes");
        return Err(Error::InvalidDataLength.into());
    }

    account_data.file_name = file_name;
    account_data.description = description;

    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    Ok(())
}
